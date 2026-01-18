-- CreateTable
CREATE TABLE "users" (
    "UserID" SERIAL NOT NULL,
    "UserName" VARCHAR(250) NOT NULL,
    "EmailAddress" VARCHAR(500) NOT NULL,
    "Password" VARCHAR(50) NOT NULL,
    "MobileNo" VARCHAR(50) NOT NULL,
    "ProfileImage" VARCHAR(500),
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "peoples" (
    "PeopleID" SERIAL NOT NULL,
    "PeopleCode" VARCHAR(50),
    "Password" VARCHAR(50) NOT NULL,
    "PeopleName" VARCHAR(250) NOT NULL,
    "Email" VARCHAR(150) NOT NULL,
    "MobileNo" VARCHAR(50) NOT NULL,
    "Description" VARCHAR(500),
    "IsActive" BOOLEAN DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "peoples_pkey" PRIMARY KEY ("PeopleID")
);

-- CreateTable
CREATE TABLE "categories" (
    "CategoryID" SERIAL NOT NULL,
    "CategoryName" VARCHAR(250) NOT NULL,
    "LogoPath" VARCHAR(250),
    "IsExpense" BOOLEAN NOT NULL,
    "IsIncome" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Description" VARCHAR(500),
    "Sequence" DECIMAL(10,2),
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "SubCategoryID" SERIAL NOT NULL,
    "SubCategoryName" VARCHAR(250) NOT NULL,
    "LogoPath" VARCHAR(250),
    "IsExpense" BOOLEAN NOT NULL,
    "IsIncome" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Description" VARCHAR(500),
    "Sequence" DECIMAL(10,2),
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("SubCategoryID")
);

-- CreateTable
CREATE TABLE "projects" (
    "ProjectID" SERIAL NOT NULL,
    "ProjectName" VARCHAR(250) NOT NULL,
    "ProjectLogo" VARCHAR(250),
    "ProjectStartDate" TIMESTAMP(3),
    "ProjectEndDate" TIMESTAMP(3),
    "ProjectDetail" VARCHAR(500),
    "Description" VARCHAR(500),
    "IsActive" BOOLEAN DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("ProjectID")
);

-- CreateTable
CREATE TABLE "expenses" (
    "ExpenseID" SERIAL NOT NULL,
    "ExpenseDate" TIMESTAMP(3) NOT NULL,
    "Amount" DECIMAL(18,2) NOT NULL,
    "ExpenseDetail" VARCHAR(500),
    "AttachmentPath" VARCHAR(250),
    "Description" VARCHAR(500),
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER,
    "SubCategoryID" INTEGER,
    "PeopleID" INTEGER NOT NULL,
    "ProjectID" INTEGER,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("ExpenseID")
);

-- CreateTable
CREATE TABLE "incomes" (
    "IncomeID" SERIAL NOT NULL,
    "IncomeDate" TIMESTAMP(3) NOT NULL,
    "Amount" DECIMAL(18,2) NOT NULL,
    "IncomeDetail" VARCHAR(500),
    "AttachmentPath" VARCHAR(250),
    "Description" VARCHAR(500),
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER,
    "SubCategoryID" INTEGER,
    "PeopleID" INTEGER NOT NULL,
    "ProjectID" INTEGER,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("IncomeID")
);

-- CreateTable
CREATE TABLE "logs" (
    "LogID" SERIAL NOT NULL,
    "ActionType" VARCHAR(50) NOT NULL,
    "EntityName" VARCHAR(100) NOT NULL,
    "EntityID" INTEGER,
    "OldData" TEXT,
    "NewData" TEXT,
    "IPAddress" VARCHAR(50),
    "UserAgent" VARCHAR(255),
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("LogID")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_EmailAddress_key" ON "users"("EmailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "peoples_UserID_Email_key" ON "peoples"("UserID", "Email");

-- AddForeignKey
ALTER TABLE "peoples" ADD CONSTRAINT "peoples_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "categories"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "categories"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_SubCategoryID_fkey" FOREIGN KEY ("SubCategoryID") REFERENCES "sub_categories"("SubCategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_PeopleID_fkey" FOREIGN KEY ("PeopleID") REFERENCES "peoples"("PeopleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "projects"("ProjectID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "categories"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_SubCategoryID_fkey" FOREIGN KEY ("SubCategoryID") REFERENCES "sub_categories"("SubCategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_PeopleID_fkey" FOREIGN KEY ("PeopleID") REFERENCES "peoples"("PeopleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "projects"("ProjectID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
