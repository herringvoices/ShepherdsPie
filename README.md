# **Shepherd's Pies Order Management System**  

A full-stack **order management system** for a fictional pizza restaurant, **Shepherd's Pies**, designed to help employees manage dine-in and delivery orders efficiently. Built with **ASP.NET Core Web API, React, and PostgreSQL**, this system allows employees to create, modify, and track orders, manage employees, and generate sales reports.  

---

## **📌 Features**  

- **User Authentication & Roles:** Secure login system with role-based access for admins and employees.  
- **Order Management:** Employees can create, update, and cancel orders, assign deliveries, and track sales.  
- **Pizza Customization:** Customers can select from different sizes, cheese, sauce, and toppings.  
- **Employee Management:** Admins can add, update, and deactivate employees.  
- **Sales Reporting:** Monthly sales reports track revenue and highlight the most popular pizza choices.  
- **Data-Driven UI:** Orders are displayed with automatic sorting by date for easy management.  

---

## **💻 Tech Stack**  

### **Backend**  
- **ASP.NET Core Web API** – Using controllers to handle structured endpoint management  
- **Entity Framework Core** – ORM for database interactions  
- **PostgreSQL** – Relational database for persistent storage  
- **ASP.NET Identity** – For authentication and role-based access control  

### **Frontend**  
- **React** – Client-side UI  
- **React Router** – Navigation & routing  
- **Reactstrap** – Bootstrap components for styling  
- **Vite** – Development bundler  

### **Development Tools**  
- **GitHub Project Board** – For issue tracking and project organization  
- **User Secrets in .NET** – Securely storing the database connection string and admin credentials  

---

## **📥 Installation & Setup**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/herringvoices/ShepherdsPie.git
cd ShepherdsPie
```

### **2️⃣ Set Up the API**  

1. **Initialize User Secrets**  
   ```bash
   dotnet user-secrets init
   ```

2. **Set the PostgreSQL Connection String**  
   Replace `{postgresUsername}` and `{your password}` with your actual PostgreSQL credentials:  
   ```bash
   dotnet user-secrets set ShepherdsPieDbConnectionString "Host=localhost;Port=5432;Username={postgresUsername};Password={your password};Database=ShepherdsPie"
   ```

3. **Set the Admin Password**  
   Replace `{YourAdminPassword}` with a secure password for the default admin account:  
   ```bash
   dotnet user-secrets set AdminPassword {YourAdminPassword}
   ```

   - **Default Admin Email:** `admin@example.com`  
   - **The password will be the one set above.**  

4. **Install Dependencies**  
   ```bash
   dotnet restore
   ```

5. **Run Database Migrations**  
   ```bash
   dotnet ef database update
   ```

6. **Start the API Server**  
   ```bash
   dotnet run
   ```

---

### **3️⃣ Set Up the Frontend**  

1. Navigate to the client directory:  
   ```bash
   cd client
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the React app:  
   ```bash
   npm run dev
   ```

4. Open the browser and follow the link in the terminal.  

---

## **🔍 Key Learnings & Takeaways**  

During development, I gained valuable experience in:  

- **Building efficient API endpoints** – Instead of creating separate endpoints for pizzas and toppings, I designed a **single order endpoint** that handles all aspects of an order.  
- **Using query parameters** – Leveraging query parameters for filtering and retrieving data dynamically, reducing unnecessary API calls.  
- **Implementing Authentication & Authorization** – Used **ASP.NET Identity** to secure user logins and enforce **role-based access control**.  
- **Secure Configuration with User Secrets** – Learned to manage sensitive information like connection strings and admin credentials without exposing them in the repository.  
- **Integrating EF Core with PostgreSQL** – Handling migrations, relationships, and database queries effectively.  
- **Structuring a full-stack application** – Designing both the backend and frontend with scalability in mind.  
