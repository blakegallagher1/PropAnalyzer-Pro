from dataclasses import dataclass
from decimal import Decimal
from typing import Dict, List

import numpy_financial as npf


@dataclass
class AnalysisResults:
    # Monthly
    monthly_gross_income: Decimal
    monthly_effective_income: Decimal
    monthly_operating_expenses: Decimal
    monthly_noi: Decimal
    monthly_debt_service: Decimal
    monthly_cash_flow: Decimal

    # Annual
    annual_gross_income: Decimal
    annual_noi: Decimal
    annual_cash_flow: Decimal

    # Metrics
    cap_rate: Decimal
    cash_on_cash_return: Decimal
    dscr: Decimal
    irr: Decimal
    total_cash_invested: Decimal


class DealCalculator:
    """Core financial calculation engine."""

    def __init__(self, analysis_data: Dict):
        self.acquisition = analysis_data.get("acquisition", {})
        self.financing = analysis_data.get("financing", {})
        self.income = analysis_data.get("income", {})
        self.expenses = analysis_data.get("expenses", {})
        self.exit = analysis_data.get("exit_strategy", {})

    def calculate(self) -> AnalysisResults:
        """Run a complete deal analysis."""

        purchase_price = Decimal(str(self.acquisition.get("purchase_price", 0)))
        closing_costs = Decimal(str(self.acquisition.get("closing_costs", {}).get("total", 0)))
        renovation = Decimal(str(self.acquisition.get("renovation_budget", 0)))

        total_acquisition = purchase_price + closing_costs + renovation

        down_payment_pct = Decimal(str(self.financing.get("down_payment_pct", 25))) / 100
        down_payment = purchase_price * down_payment_pct
        loan_amount = purchase_price - down_payment

        total_cash = down_payment + closing_costs + renovation

        interest_rate = float(self.financing.get("interest_rate", 7.5)) / 100 / 12
        term_months = int(self.financing.get("term_years", 30)) * 12

        if loan_amount > 0 and interest_rate > 0:
            monthly_payment = Decimal(str(npf.pmt(interest_rate, term_months, -float(loan_amount))))
        else:
            monthly_payment = Decimal(0)

        monthly_rent = Decimal(str(self.income.get("rental_income", {}).get("base_rent", 0)))
        vacancy_rate = Decimal(str(self.income.get("vacancy_rate_pct", 5))) / 100

        monthly_gross = monthly_rent
        monthly_effective = monthly_gross * (1 - vacancy_rate)

        annual_tax = Decimal(str(self.expenses.get("property_tax", 0)))
        annual_insurance = Decimal(str(self.expenses.get("insurance", 0)))
        hoa_monthly = Decimal(str(self.expenses.get("hoa_fees", 0)))

        maintenance_pct = Decimal(str(self.expenses.get("maintenance_pct", 5))) / 100
        pm_pct = Decimal(str(self.expenses.get("property_management_pct", 0))) / 100
        capex_pct = Decimal(str(self.expenses.get("capex_reserve_pct", 5))) / 100

        monthly_fixed = (annual_tax / 12) + (annual_insurance / 12) + hoa_monthly
        monthly_variable = monthly_gross * (maintenance_pct + pm_pct + capex_pct)

        monthly_opex = monthly_fixed + monthly_variable

        monthly_noi = monthly_effective - monthly_opex
        monthly_cash_flow = monthly_noi - monthly_payment

        annual_gross = monthly_gross * 12
        annual_noi = monthly_noi * 12
        annual_cash_flow = monthly_cash_flow * 12

        cap_rate = (annual_noi / total_acquisition * 100) if total_acquisition > 0 else Decimal(0)
        coc_return = (annual_cash_flow / total_cash * 100) if total_cash > 0 else Decimal(0)
        dscr = (annual_noi / (monthly_payment * 12)) if monthly_payment > 0 else Decimal(0)

        hold_years = int(self.exit.get("hold_period_years", 5))
        cash_flows = self._calculate_cash_flows(
            monthly_cash_flow,
            hold_years,
            loan_amount,
            monthly_payment,
            total_acquisition,
        )

        try:
            irr = Decimal(str(npf.irr([-float(total_cash)] + cash_flows) * 100))
        except (ValueError, FloatingPointError):
            irr = Decimal(0)

        return AnalysisResults(
            monthly_gross_income=round(monthly_gross, 2),
            monthly_effective_income=round(monthly_effective, 2),
            monthly_operating_expenses=round(monthly_opex, 2),
            monthly_noi=round(monthly_noi, 2),
            monthly_debt_service=round(monthly_payment, 2),
            monthly_cash_flow=round(monthly_cash_flow, 2),
            annual_gross_income=round(annual_gross, 2),
            annual_noi=round(annual_noi, 2),
            annual_cash_flow=round(annual_cash_flow, 2),
            cap_rate=round(cap_rate, 2),
            cash_on_cash_return=round(coc_return, 2),
            dscr=round(dscr, 2),
            irr=round(irr, 2),
            total_cash_invested=round(total_cash, 2),
        )

    def _calculate_cash_flows(
        self,
        monthly_cf: Decimal,
        hold_years: int,
        loan_amount: Decimal,
        monthly_payment: Decimal,
        purchase_price: Decimal,
    ) -> List[float]:
        """Calculate year-by-year cash flows including an exit event."""

        annual_cf = float(monthly_cf * 12)
        cash_flows = [annual_cf] * hold_years

        exit_cap = float(self.exit.get("exit_cap_rate", 7)) / 100
        final_noi = annual_cf + (float(monthly_payment) * 12)
        exit_price = final_noi / exit_cap if exit_cap > 0 else float(purchase_price)

        selling_costs = exit_price * 0.06
        remaining_balance = float(loan_amount) * 0.8

        exit_proceeds = exit_price - selling_costs - remaining_balance

        if cash_flows:
            cash_flows[-1] += exit_proceeds

        return cash_flows
