-- CreateIndex
CREATE INDEX "expenses_PeopleID_IsDeleted_ExpenseDate_idx" ON "expenses"("PeopleID", "IsDeleted", "ExpenseDate");

-- CreateIndex
CREATE INDEX "expenses_UserID_IsDeleted_ExpenseDate_idx" ON "expenses"("UserID", "IsDeleted", "ExpenseDate");

-- CreateIndex
CREATE INDEX "incomes_PeopleID_IsDeleted_IncomeDate_idx" ON "incomes"("PeopleID", "IsDeleted", "IncomeDate");

-- CreateIndex
CREATE INDEX "incomes_UserID_IsDeleted_IncomeDate_idx" ON "incomes"("UserID", "IsDeleted", "IncomeDate");
