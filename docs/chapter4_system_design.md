Chapter 4: System Design

Introduction

We will build the UOG Tewodros Campus Human Resource Management System (HRMS) on a robust multi-tier architecture, offering the scalability, security, and efficiency that our academic institution requires. We will divide the system into three basic layers:

Presentation Layer: This will be the front door by which our HR officers, department heads, deans, and employees will interact with the system. We will design it to include a responsive web interface that ensures seamless and easy user interactions across all devices.

Application Layer: In this layer, we will place our business logic to process all critical activities such as user login, leave management, recruitment, performance appraisals, and notifications.

Data Layer: We will use this layer to control and keep all system information like employee profiles, academic records, leave requests, and audit logs. We will specifically design it to provide data integrity and consistency while allowing for real-time updates.

We will base our platform on a modular design, and we will divide the core operations into individual subsystems. This approach will provide us with maintainability, scalability, and flexibility, so we will be able to easily update the system and remain responsive to changing university policies.

4.2. Current Software Architecture

The existing system that we will replace is primarily an offline, manual system where HR staff and employees physically interact to process administrative tasks. As we observed, the existing system does not have a comprehensive HR platform but utilizes traditional business operations such as:

Paper-Based Transactions: Employees and administrators manage requests by physically exchanging paper documents, which we have identified as time-wasting and inefficient.

Manual Record Keeping: The HR Directorate tracks records and statistics manually using paper files or basic spreadsheets, which we found to be prone to errors and difficult to handle as staff numbers grow.

Limited Data Visibility: Decisions are made based on fragmented data, which leads to slow administrative responses and a lack of transparency for the university management.

No Real-Time Tracking: Employees cannot track the status of their requests, such as leave or promotion applications, leading to frustration.

Reliability on Physical Presence: Most processes require physical presence, which limits flexibility and efficiency.

Our migration to the proposed HRMS will eliminate these labor-intensive practices with a dynamic, web-based system that will provide real-time tracking, secure data handling, and a formalized administrative experience.

4.3. Proposed Software Architecture

Our system design will be guided by the following objectives:

Key Design Considerations

Performance Optimization: We will implement caching policies, query optimized database, and asynchronous processing to ensure a seamless user experience.

Fault Tolerance: We will maintain redundancy by implementing robust error handling and automated backup capabilities.

User Experience (UX): Our design will boast user-friendly navigation, responsive design, and accessibility features to enable a smooth experience for all staff members.

Interoperability: We will enable integration capabilities with other potential university systems, such as payroll or student information systems.

4.3.1. System Decomposition

System decomposition describes the breakdown of the HRMS system into subsystems, detailing their responsibilities and interactions. This is a key output of the system design phase.

Below is a UML component diagram that depicts the system components and their interactions for the context of UOG Tewodros Campus HRMS:

```mermaid
componentDiagram
    package "Presentation Layer" {
        [Web Browser]
        [Mobile Interface]
    }

    package "Application Layer" {
        [Auth & Security Service]
        [Employee Mgmt Service]
        [Leave & Attendance Service]
        [Payroll Service]
        [Recruitment Service]
        [Performance Service]
        [Doc Mgmt Service]
    }

    package "Data Layer" {
        [MySQL Database]
        [File Storage]
    }

    [Web Browser] --> [Auth & Security Service]
    [Web Browser] --> [Employee Mgmt Service]
    
    [Auth & Security Service] --> [MySQL Database]
    [Employee Mgmt Service] --> [MySQL Database]
    [Leave & Attendance Service] --> [MySQL Database]
    [Payroll Service] --> [MySQL Database]
    [Recruitment Service] --> [MySQL Database]
    [Performance Service] --> [MySQL Database]
    
    [Doc Mgmt Service] --> [File Storage]
    
    [Employee Mgmt Service] ..> [Payroll Service] : Data Feed
    [Leave & Attendance Service] ..> [Payroll Service] : Data Feed
```

The system is composed of the following key subsystems:

1.  **Authentication and Security Subsystem**
    *   **Responsibilities**: Handles user authentication, authorization, and session management. It enforces role-based access control (RBAC) to ensure that users (Admins, HR Staff, Department Heads, Employees) only access appropriate features.

2.  **Employee Management Subsystem**
    *   **Responsibilities**: Manages the core records of all university staff. It handles personal details, employment history, academic ranks, and department placements. This is the central source of truth for all employee data.

3.  **Attendance and Leave Subsystem**
    *   **Responsibilities**: Tracks daily attendance and manages the entire leave lifecycle (application, approval, and balance tracking). It integrates with the payroll system to ensure accurate compensation calculations based on attendance.

4.  **Payroll and Compensation Subsystem**
    *   **Responsibilities**: Automates the calculation of salaries, tax deductions, pension contributions, and allowances. It generates payslips and financial reports, drawing data from the Employee and Attendance subsystems.

5.  **Recruitment and Hiring Subsystem**
    *   **Responsibilities**: Streamlines the talent acquisition process, including job posting, applicant tracking, and interview management. It facilitates the hiring of both academic and administrative staff.

6.  **Performance Appraisal Subsystem**
    *   **Responsibilities**: Manages the periodic evaluation of staff. It allows for setting KPIs, conducting 360-degree reviews (peer, manager, self), and storing appraisal results to support decisions on promotions and raises.

7.  **Document Management Subsystem**
    *   **Responsibilities**: Provides a secure repository for digitized HR documents such as contracts, appointment letters, and credentials, ensuring easy retrieval and reducing paper dependency.

8.  **Training and Development Subsystem**
    *   **Responsibilities**: Tracks employee skills, schedules training sessions, and records professional development milestones to ensure continuous staff improvement.

4.3.2. Security Architecture

Security is a paramount concern for the HRMS. We will implement a multi-layered security definition that covers infrastructure, data transport, and application logical access.

1.  **Infrastructure Security (SSH)**
    *   **Secure Shell (SSH) Access**: Administrative access to the backend servers and database servers will be strictly restricted to authorized personnel using SSH keys (RSA 4096-bit). Password-based authentication for SSH will be disabled to prevent brute-force attacks.
    *   **Firewall Configuration**: The system will sit behind a firewall that allows traffic only on essential ports (80/443 for Web, 22 for SSH). Database ports (3306) will not be exposed to the public internet.

2.  **Data Transport Security (SSL/TLS)**
    *   **Encryption in Transit**: All communication between the Web/Mobile clients and the API Gateway will be encrypted using SSL/TLS 1.2+ protocols (HTTPS). This ensures that sensitive HR data cannot be intercepted during transmission.
    *   **Certificates**: Trusted CA-signed certificates will be deployed on the web server/load balancer.

3.  **Application Security**
    *   **Authentication**: We use JSON Web Tokens (JWT) for stateless session management.
    *   **Password Hashing**: User passwords are heavily salted and hashed using `bcrypt` before storage.
    *   **Input Validation**: All API inputs will be sanitized to prevent SQL Injection and XSS attacks.

4.3.3. Hardware/Software Mapping

The proposed HRMS platform will be deployed on a combination of hardware and software components to ensure scalability, reliability, and performance. The system will use a client-server architecture, where the frontend (user interface) will run on the client side, and the backend (server-side logic and database) will run on remote servers.

Below is the mapping of subsystems to hardware and software components:

| Component Category | Hardware Requirements | Software Requirements |
| :--- | :--- | :--- |
| **Client Side (Frontend)** | **Devices**: Desktop PCs, Laptops, Tablets, or Smartphones.<br>**Specs**: Minimum 4GB RAM, 1.5GHz Processor. | **Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari (Modern versions).<br>**OS**: Windows, macOS, Android, or iOS. |
| **Application Server (Backend)** | **Server**: Dedicated Server or Cloud Instance.<br>**Specs**: Multi-core CPU (e.g., Xeon or i7), 16GB+ RAM, 500GB SSD Storage. | **Runtime**: Node.js (v18+).<br>**Framework**: Express.js.<br>**OS**: Linux (Ubuntu/CentOS) or Windows Server. |
| **Database Server** | **Server**: Dedicated Database Server (can be separate or shared with App Server depending on scale).<br>**Specs**: High-speed SSDs for I/O performance, 16GB+ RAM. | **DBMS**: MySQL 8.0+.<br>**Tools**: MySQL Workbench (for management). |
| **Network** | **Infrastructure**: Local Area Network (LAN) for campus intranet access, Internet connection for remote access. | **Protocols**: HTTP/HTTPS, TCP/IP.<br>**Security**: SSL/TLS Certificates. |

Traceability Information

We will design the system in a way that directly maps HR functionalities, employee management, and admin observation to their corresponding subsystems and functions. Our system requirements dictate our main decisions, such as the choice of database schema, security functions, and optimization for performance. Restrictions like security, performance optimization, and high availability have driven our architecture choices. Moreover, our requirement for real-time tracking of requests has impacted our selection of a scalable backend and efficient data management practices. In general, our HRMS architecture will achieve a highly efficient balance between functionality, performance, security, and maintainability, so it will serve both the administrative demands and the needs of our university staff.
