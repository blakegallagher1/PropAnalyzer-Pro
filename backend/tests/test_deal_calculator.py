from app.services.deal_calculator import DealCalculator


def test_deal_calculator_basic():
    data = {
        "acquisition": {
            "purchase_price": 400000,
            "closing_costs": {"total": 10000},
            "renovation_budget": 20000,
        },
        "financing": {
            "down_payment_pct": 25,
            "interest_rate": 6.0,
            "term_years": 30,
        },
        "income": {
            "rental_income": {"base_rent": 2500},
            "vacancy_rate_pct": 5,
        },
        "expenses": {
            "property_tax": 8000,
            "insurance": 1500,
            "hoa_fees": 0,
            "maintenance_pct": 5,
            "property_management_pct": 8,
            "capex_reserve_pct": 5,
        },
        "exit_strategy": {
            "hold_period_years": 5,
            "exit_cap_rate": 6.5,
        },
    }

    calculator = DealCalculator(data)
    results = calculator.calculate()

    assert results.monthly_cash_flow is not None
    assert results.cap_rate >= 0
    assert results.cash_on_cash_return >= 0
