Human Resource Management is the backbone of any large institution, ensuring that the right people are in the right roles and are managed effectively throughout their employment lifecycle. At the University of Gondar, a premier higher education institution with thousands of academic, administrative, and support staff, the scale and complexity of HR operations are substantial. Currently, the HR Directorate relies predominantly on manual processes and decentralized digital records (such as standalone spreadsheets and word processors) to manage this vast workforce. Employee records are often maintained in physical files, which are vulnerable to damage, loss, and unauthorized access. Critical processes like leave approval, recruitment tracking, and performance appraisal follow-ups involve paper forms that must be physically routed between departments, colleges, and the central HR office. This manual paradigm leads to several systemic challenges: significant delays in processing requests, difficulties in retrieving and consolidating information for reporting, high risks of data inconsistency and loss, lack of real-time visibility into HR metrics for decision-makers, and an overwhelming administrative burden on HR staff who must manage these repetitive, manual tasks. In the era of digital transformation, where agility, accuracy, and data-driven decision-making are paramount, this reliance on outdated methods hinders operational excellence. Therefore, there is a critical and urgent need to develop an integrated, web-based **UOG Tede Campus Human Resource Management System (HRMS)** that can automate, streamline, and bring transparency to all core HR functions at the University of Gondar. This advanced system incorporates **predictive workforce analytics** to anticipate staffing needs and **AI-driven candidate matching** to optimize the recruitment process, ensuring a modern, efficient, and data-intelligent administrative environment.

### 1.2. General Objective

The general objective of this project is to design, develop, and deploy a comprehensive, secure, and web-based **UOG Tede Campus Human Resource Management System (HRMS)** that digitalizes and automates the core HR processes of the University of Gondar, integrating **predictive workforce analytics** and **AI-driven candidate matching** to enhance decision-making and operational efficiency, while aligning perfectly with the university's organizational structure and policies.

### 1.3. Specific Objectives

To achieve the general objective, the following specific objectives have been formulated:

*   To analyze the existing HR processes and identify major limitations.
*   To develop a centralized digital personnel record management module.
*   To automate leave management based on UoG HR rules and approval hierarchies.
*   To design a recruitment and selection module with multi-stage workflows.
*   To build a training and performance evaluation module based on UoG practices.
*   To implement role-based access control for HR officers, department heads, deans, and administrators.
*   To develop reporting and analytics tools for informed HR decision-making.
*   To ensure data security, integrity, and reliability through modern technologies.
*   To integrate the system with future organizational needs and scalable modules.
*   To incorporate **AI-driven candidate matching algorithms** to streamline recruitment by automatically filtering and ranking applicants based on job requirements.
*   To implement **predictive workforce analytics** to forecast staffing trends, identify turnover risks, and support strategic HR planning.

### 1.4. Scope of the Project

This project focuses on analyzing, designing, and implementing a web-based **UOG Tede Campus HRMS** supporting key HR operations. The system integrates advanced **AI features** to enhance efficiency and decision-making. The scope includes:

*   **Employee Profile Management:** Centralized database for personal, academic, and employment records.
*   **Leave Management:** Automated request, approval, and tracking workflows.
*   **Recruitment and Selection Module:** End-to-end management with **AI-driven candidate matching**.
*   **Performance Evaluation:** Annual appraisal workflows and tracking.
*   **Training and Development:** Tracking of employee training programs and history.
*   **Document Management:** Secure storage for contracts, certificates, and official letters.
*   **Organizational Structure Management:** Configuration of Colleges, Departments, and HR Units.
*   **Role-Based Access Control:** Secure authorization and approval workflows (Admin, HR, Dean, Head).
*   **Reporting and Analytics:** Comprehensive dashboards with **predictive workforce analytics**.

The system targets administrative staff, HR directorate officers, college deans, department heads, and system administrators. **Note:** Integration with payroll or biometric attendance is not included in this phase but may be considered in future enhancements.

### 1.5. Users of the System

The successful implementation of the **UOG Tede Campus HRMS** will serve various stakeholders within and outside the university. The primary users of the system include:

*   **HR Directorate & Administrative Staff:** The core users who manage employee records, recruitment processes, leave requests, and training programs. They will leverage AI features for candidate screening and strategic planning.
*   **University Management (Deans & Heads):** Responsible for approving leave requests, conducting performance appraisals, and utilizing analytics dashboards for decision-making.
*   **Employees (Academic & Support Staff):** Access the self-service portal to update profiles, request leave, view performance history, and access official documents.
*   **System Administrators:** Technology professionals responsible for system maintenance, user management, data security, and configuration of organizational settings.
*   **Job Applicants:** External users who interact with the recruitment portal to create profiles and apply for vacancies, where their applications are processed by the **AI-driven matching system**.

### 1.6. Limitations of the Project

Despite the system’s comprehensive and university-tailored design, certain practical and technical constraints necessitate the acknowledgment of specific limitations. These limitations are primarily driven by project scope, resource availability, and phased implementation strategy.

*   **No Full Payroll Processing:** The system will not include full payroll processing functionality. While it will capture and manage essential payroll-related data—such as salary grades, basic pay, allowances, deductions, tax brackets, and pension enrollment—it will not generate actual payslips or directly interface with external payroll software used by the University of Gondar’s Finance Office. This module is intentionally designed as a configurable data layer to support future integration if institutional requirements evolve.
*   **Manual Attendance Integration:** Although the attendance management module is architecturally prepared to support biometric devices (such as fingerprint or facial recognition scanners), actual hardware integration will depend on the availability and compatibility of physical devices at Tede Campus. In the absence of such infrastructure, attendance will rely on manual check-in/check-out or supervisor-verified timesheets.
*   **No Native Mobile Application:** A dedicated mobile application will not be developed in Phase 1. Instead, the system will be built as a fully responsive web application, ensuring optimal usability across desktops, tablets, and smartphones through adaptive design. A native mobile app may be considered in a future enhancement phase, pending user demand and resource allocation.
*   **Single Campus Scope:** The system is explicitly scoped to serve only the **Tede Campus** of the University of Gondar. It does not support multi-campus or university-wide deployment. Organizational structures, workflows, and user hierarchies are modeled exclusively for Tede Campus units.
*   **Offline Functionality:** The HRMS requires continuous internet connectivity and does not support offline functionality. All user interactions—profile updates, leave requests, performance submissions—must occur online.
*   **AI Feature Limitations:** While the system incorporates **AI-driven candidate matching** and **predictive analytics**, the accuracy and effectiveness of these features are dependent on the volume and historical quality of data available at launch. Additionally, these AI components are designed as **decision-support tools**, providing recommendations to HR staff rather than making autonomous hiring or strategic decisions, ensuring human oversight is always maintained.

### 1.7. System Development Approach

The **UOG Tede Campus HRMS** project will adopt the **Agile Software Development Methodology**, specifically the **Scrum framework**, to guide the design, implementation, and validation of the system. We select this approach due to its proven effectiveness in managing dynamic requirements, fostering stakeholder collaboration, and enabling incremental value delivery—critical factors in a university environment where HR policies and administrative needs may evolve during development.

**Implementation Strategy:** The project timeline will be divided into **two-week sprints**, each culminating in a potentially shippable increment of the system. At the beginning of each sprint, the development team will prioritize features from the master module list (e.g., Employee Profile Management, Leave Management, AI-Driven Recruitment, Performance Evaluation) in close consultation with the **UOG Tede Campus HR Office**, who will serve as the primary product owner. At the end of each sprint, a **sprint review meeting** will be conducted to demonstrate completed functionality and gather feedback, which will then be incorporated into the next iteration.

**Technology Stack:** The system will be built as a modern full-stack web application:

*   **Frontend:** React with TypeScript, utilizing Vite for fast development, React Router for navigation, TailwindCSS for responsive design, and state management via React Hooks
*   **Backend:** Node.js with Express framework, providing RESTful API endpoints for all system operations
*   **Database:** MySQL for structured data storage, ensuring ACID compliance and data integrity
*   **AI Integration:** Statistical libraries and predictive algorithms integrated via backend microservices for candidate matching and workforce analytics

**Key Advantages of This Approach:**

*   **Flexibility:** Requirements can be refined or reprioritized based on real-world feedback or policy updates from the university administration.
*   **Transparency:** Progress is visible through sprint backlogs, task boards, and regular demonstrations to stakeholders.
*   **User-Centric Design:** Continuous involvement of HR staff, department heads, and deans ensures the system aligns with actual workflows, not just theoretical models.
*   **Risk Mitigation:** Early identification of technical or usability issues reduces the likelihood of late-stage failures and ensures smooth deployment.
*   **Incremental AI Enhancement:** AI features can be iteratively refined as more historical HR data becomes available, improving prediction accuracy over time.

This iterative and collaborative strategy will ensure that the final HRMS is not only technically robust but also operationally relevant and institutionally accepted—a critical success factor for adoption in a public university setting. The web-based architecture will ensure accessibility from any device with internet connectivity, while role-based access control and JWT authentication will guarantee security and data integrity across all user interactions.

### 1.8. Business Rules

The following business rules will serve as the foundation for the proposed HRMS to function in harmony and provide a consistent, compliant, and efficient experience for all users—HR staff, department heads, academic staff, and administrative personnel. We derive these rules from UOG HR policies, Ethiopian Civil Service Proclamations, and operational realities at Tede Campus. They will serve as the basis for data integrity, workflow automation, and regulatory compliance throughout the system.

#### 1.8.1. Organizational Structure and Onboarding

*   **BR-01:** All employees must be assigned to a valid organizational unit (College → Department → Section) at the time of onboarding. No employee profile will exist without a defined department and job title.

#### 1.8.2. Performance Appraisal Requirements

*   **BR-02:** Academic staff (Lecturers, Assistant Professors, Associate Professors, Full Professors) must provide evidence of teaching load, research output, and community service during annual performance appraisal cycles. The system will require document uploads for each KPI category before submission.

#### 1.8.3. Leave Management Policies

*   **BR-03:** Leave balances will be automatically calculated based on employment type:
    *   **Academic Staff:** 30 days of annual leave per year
    *   **Administrative/Technical Staff:** 24 days of annual leave per year
    *   Unused leave may carry forward up to 50% of the annual entitlement, as per UOG policy.

*   **BR-04:** Study leave with pay will only be granted to confirmed staff with at least five (5) years of continuous service. The system will validate service duration before allowing submission of such requests.

#### 1.8.4. Promotion Workflow

*   **BR-05:** All promotion requests for academic staff must pass through a four-level approval workflow:
    1.  Employee Submission
    2.  Department Head Review
    3.  Dean Approval
    4.  HR Office Verification
    5.  Vice President for Academic Affairs Final Approval

#### 1.8.5. Employment Category Restrictions

*   **BR-06:** Contract-based staff will not be eligible for sabbatical leave, housing allocation, or pension enrollment. The system will enforce these restrictions based on employment category.

#### 1.8.6. Disciplinary Case Management

*   **BR-07:** Disciplinary cases must follow a formal process with all stages documented in the system:
    1.  Case Creation
    2.  Investigation Committee Assignment
    3.  Hearing
    4.  Warning/Suspension Letter Issuance
    5.  Appeal Window (15 working days)

#### 1.8.7. Document Management Standards

*   **BR-08:** Employee documents (e.g., degree certificates, ID cards, appointment letters) must be uploaded in PDF or JPEG format, with a maximum file size of 5 MB. The system will reject unsupported formats or oversized files.

#### 1.8.8. User Account Administration

*   **BR-09:** Only HR Administrators can create, deactivate, or delete user accounts. Department Heads and Deans can initiate onboarding requests but cannot bypass HR verification.

#### 1.8.9. Audit Trail and Compliance

*   **BR-10:** The system must log all critical actions (e.g., document deletion, role change, approval override) with timestamp, user ID, and action type for audit and compliance purposes.

---

**Realism and Feasibility Analysis:** These business rules are realistic and directly aligned with the operational requirements of UOG Tede Campus. The leave entitlements (30 days for academic, 24 days for administrative staff) follow Ethiopian Civil Service Proclamation guidelines. The multi-level approval workflow reflects the hierarchical structure of Ethiopian public universities. The five-year service requirement for study leave with pay is consistent with standard government HR policies. The 15-day appeal window for disciplinary cases aligns with due process requirements in public institutions. All rules are implementable within the proposed technology stack (React, Node.js, MySQL) without requiring specialized infrastructure.

---

### 1.9. Significance of the Project

The proposed **UOG Tede Campus Human Resource Management System** holds substantial practical and strategic value for the University of Gondar – Tede Campus, particularly in light of Ethiopia's ongoing national digital transformation agenda. At present, HR operations at Tede Campus remain heavily reliant on paper-based records, Excel spreadsheets, and informal communication channels—methods that are increasingly inadequate for a growing academic institution with hundreds of staff members across academic and administrative units.

**Addressing Institutional Inefficiencies:** This HRMS will directly address these inefficiencies by introducing a centralized, role-based digital platform that aligns with UOG's existing HR policies while accommodating the unique workflows of a university environment—such as academic promotions, teaching load assignment, sabbatical leave, and research tracking. Unlike generic HR software, the system will be custom-built for Tede Campus, ensuring relevance to local job titles (e.g., Lecturer I, Dean, Registrar), employment categories (academic, administrative, contract), and approval hierarchies.

**AI-Driven Decision Support:** A distinguishing feature of this system will be the integration of **artificial intelligence capabilities** that provide tangible operational value. The **AI-driven candidate matching** module will analyze job requirements against applicant profiles, automatically filtering and ranking candidates based on qualifications, experience, and institutional fit—significantly reducing the time HR staff spend on initial screening during recruitment cycles. The **predictive workforce analytics** component will use historical employee data to forecast staffing trends, identify potential turnover risks, and support strategic HR planning. These AI features are designed as **decision-support tools** that will augment human judgment rather than replace it, ensuring ethical and context-aware HR management. As the system accumulates more data over time, the accuracy and utility of these predictive models will continuously improve, making this a forward-looking investment in data-driven institutional management.

**Compliance and Accountability:** The system will support compliance and accountability by maintaining comprehensive audit trails for critical actions (e.g., leave approvals, disciplinary cases, document uploads, AI recommendation usage) and enforcing role-based access control—reducing the risk of data tampering or unauthorized disclosures. For a public university operating under strict civil service regulations, this level of transparency is not just beneficial but institutionally necessary.

**Capacity Building and Knowledge Transfer:** From a developmental perspective, the project will also serve as a capacity-building milestone for the Department of Computer Science at Tede Campus. It will demonstrate the department's ability to deliver real-world, institutionally impactful software solutions using modern, scalable technologies (React, Node.js, MySQL, AI/ML integration) while adhering to academic project standards. If successfully piloted, the system could become a reference model for other campuses within UOG or even other Ethiopian public universities seeking affordable, localized HR digitization.

**Pragmatic and Feasible Design:** Critically, the design will prioritize **realism and feasibility**—it will not assume high-end infrastructure, will require only basic internet connectivity (aligned with current campus Wi-Fi availability), and will avoid over-engineering by focusing on core HR pain points rather than speculative features. The AI components will utilize lightweight statistical libraries and algorithms that can run efficiently on standard server infrastructure, without requiring expensive GPU resources or cloud-based machine learning platforms. This pragmatic approach will ensure the system is not only technically sound but also adoptable and maintainable within UOG's current IT and HR operational capacity.

**Long-Term Impact:** Beyond immediate operational improvements, this HRMS will represent a strategic investment in institutional modernization. By digitizing HR records and processes, the university will build a valuable data foundation that can support future analytics, policy analysis, and evidence-based decision-making. The system's modular architecture will also allow for future expansion—potential integration with payroll systems, biometric attendance devices, or even extension to other UOG campuses—ensuring that today's implementation effort continues to deliver value for years to come.

### 1.10. Beneficiaries of the Project

The **UOG Tede Campus HRMS** will deliver tangible benefits to a wide range of stakeholders within the University of Gondar – Tede Campus, each interacting with the system based on their role and responsibilities:

*   **HR Office Staff:** Will experience a significant reduction in manual data entry, physical file management, and follow-up reminders. Tasks such as leave balance calculation, employee onboarding, and report generation will be automated. Additionally, HR staff will utilize **AI-driven candidate matching** to streamline recruitment screening and leverage **predictive workforce analytics** for strategic workforce planning—enabling data-informed decisions on staffing needs and retention strategies.

*   **Department Heads and Deans:** Will gain real-time visibility into staff status, teaching assignments, leave requests, and performance appraisals within their units. The system's approval workflows (e.g., for promotions, study leave, or overtime) will streamline decision-making. Deans will also benefit from **AI-generated workforce insights** that highlight potential staffing gaps or turnover risks in their departments.

*   **Academic Staff (Lecturers, Researchers):** Will benefit from self-service access to their profiles, teaching load summaries, publication logs, and leave balances. They can submit leave requests or training applications online and track approval status—reducing dependency on in-person visits to administrative offices.

*   **Administrative and Technical Staff:** Will enjoy simplified processes for overtime requests, training registration, and document submission (e.g., ID copies, certificates), improving their overall experience with HR services.

*   **University Leadership (Vice Presidents, Registrar):** Will receive timely, accurate HR analytics—such as staff distribution by qualification, turnover rates, or compliance gaps. The **predictive analytics dashboard** enables evidence-based decisions on staffing, budgeting, and policy updates, powered by AI-driven insights that forecast workforce trends.

*   **IT Department:** Will inherit a well-documented, modular system built on open-source technologies (React, Node.js, MySQL), making future maintenance, updates, or integrations (e.g., with payroll or student information systems) more manageable without vendor lock-in. The AI components are implemented using lightweight libraries that do not require specialized infrastructure.

*   **Job Applicants:** Will benefit from a transparent, efficient recruitment process. Their applications are processed through the **AI-driven matching system**, ensuring fair and objective initial screening based on qualifications and job requirements.

*   **Students (Indirect Beneficiaries):** While not direct users, students will benefit from a more efficient and accountable academic staff environment—where lecturers spend less time on administrative delays and more time on teaching, research, and student support.

All beneficiaries will operate within the realistic constraints of UOG's current infrastructure. The system will leverage existing campus internet and basic computer literacy, with AI features designed as lightweight, server-side components that will not require specialized hardware—ensuring immediate usability upon deployment.

### 1.11. Feasibility Study

The feasibility study evaluates whether the proposed **UOG Tede Campus HRMS** can be successfully developed, deployed, and adopted within the constraints of available resources, technology, and institutional environment.

#### 1.11.1. Technical Feasibility

The project is technically feasible. The development team possesses solid proficiency in modern web development technologies—including **React with TypeScript** for the frontend, **Node.js with Express** for the backend, and **MySQL** for database management—technologies widely taught and applied in the Department of Computer Science at UOG. All required development tools (Visual Studio Code, Git, Postman, MySQL Workbench) are freely available and already installed on the team's personal laptops.

**Technology Stack Validation:**

*   **Frontend (React/TypeScript/Vite):** Industry-standard framework with extensive documentation, active community support, and proven scalability for enterprise applications.
*   **Backend (Node.js/Express):** Lightweight, high-performance runtime ideal for RESTful APIs, with straightforward deployment options.
*   **Database (MySQL):** Robust relational database ensuring ACID compliance, data integrity, and compatibility with UOG's existing IT infrastructure.
*   **AI Components:** Implemented using lightweight statistical libraries (e.g., simple-statistics) that run efficiently on standard server hardware without requiring GPU resources or cloud-based ML platforms.

**Deployment Options:** The system can be hosted using free-tier or low-cost cloud services (e.g., Railway, Render, or Vercel for frontend; PlanetScale or similar for MySQL hosting), eliminating the need for on-premise servers. Alternatively, the system can be deployed on existing campus servers if preferred by UOG IT.

**Optional Integrations:** While biometric attendance integration is architecturally supported, it is marked as optional and will not block core functionality if hardware is unavailable.

Therefore, the system can be fully developed, tested, and deployed using existing technical capacity and internet access at Tede Campus. The AI features are designed as decision-support tools using lightweight algorithms, ensuring they are maintainable by the IT department without specialized machine learning expertise.

---

## Chapter 2: Proposed System Description

### 2.1. System Overview

The proposed **UOG Tede Campus HRMS** will be a web-based, role-driven platform designed exclusively for the University of Gondar – Tede Campus. It will digitize and automate the full employee lifecycle—from recruitment and onboarding to performance appraisal, promotion, and separation—while embedding university-specific workflows such as academic load assignment, research tracking, and sabbatical management.

**Primary User Groups:**

*   **HR Administrators:** Will have full system control, reporting capabilities, and policy enforcement authority.
*   **Department Heads and Deans:** Will have approval authority, staff oversight, and performance review capabilities.
*   **Employees (Academic & Administrative):** Will access self-service features for profile updates, leave requests, training applications, and appraisal submissions.

**Technology Architecture:** Built using **React with TypeScript** for the frontend, **Node.js with Express** for the backend API, and **MySQL** for structured data storage, the HRMS will be responsive, secure, and accessible from any campus-connected device. The system will centralize fragmented HR data, eliminate paper-based delays, and provide real-time dashboards for strategic decision-making—all while operating within the realistic infrastructure and policy constraints of a public Ethiopian university.

**AI-Powered Capabilities:** The system will incorporate two key artificial intelligence features:

*   **AI-Driven Candidate Matching:** During recruitment, the system will automatically analyze job requirements against applicant profiles, filtering and ranking candidates based on qualifications, experience, and institutional fit. This will significantly reduce manual screening effort and ensure objective, data-driven shortlisting.
*   **Predictive Workforce Analytics:** The system will use historical employee data to forecast staffing trends, identify potential turnover risks, and support strategic HR planning. Dashboards will display AI-generated insights to help leadership make evidence-based decisions.

**Integration Boundaries:** The system will not replace UOG's official payroll software but will store essential payroll configuration data (salary grade, allowances, bank details) to support future integration. Similarly, while biometric attendance is supported in the system architecture, the initial release will rely on manual or supervisor-verified timesheets, reflecting current campus capabilities.

Ultimately, the HRMS aims to reduce administrative burden, improve staff satisfaction, and strengthen institutional compliance—transforming HR from a paperwork-heavy function into a strategic enabler of academic excellence at Tede Campus.

### 2.2. Functional Requirements

Functional requirements define the specific activities, actions, and system capabilities that the proposed HRMS must support to serve the needs of HR administrators, department heads, academic staff, and administrative personnel at UOG – Tede Campus.

#### 2.2.1. User Management & Authentication

*   The system shall allow HR administrators to register new employee accounts during onboarding.
*   The system shall allow all users to log in securely using university-issued credentials.
*   The system shall support role-based access control (Admin, HR Officer, Dean, Department Head, Employee).
*   The system shall allow users to log out securely at the end of their session.

#### 2.2.2. Employee Profile Management

*   The system shall allow employees to view and update their personal information, including contact details, emergency contacts, and bank account information.
*   The system shall provide a search and filter function to locate employees by name, ID, department, or job title.

#### 2.2.3. Leave Management

*   The system shall allow employees to submit leave requests (annual, sick, maternity, study leave, etc.) with start/end dates and justification.
*   The system shall support multi-level approval workflows for leave requests (e.g., Supervisor → Dean → HR).
*   The system shall automatically calculate and display leave balances based on employment type and service duration.

#### 2.2.4. Recruitment & AI-Driven Candidate Matching

*   The system shall allow HR administrators to post job vacancies with required qualifications and experience criteria.
*   The system shall allow external applicants to create profiles and submit applications.
*   The system shall provide **AI-driven candidate matching** that automatically filters and ranks applicants based on job requirements, qualifications, and institutional fit.
*   The system shall display match scores and AI recommendations to HR staff for final decision-making.

#### 2.2.5. Performance Evaluation

*   The system shall allow academic staff to upload evidence of teaching load, research publications, and community service for performance appraisal.
*   The system shall enable supervisors to complete annual appraisal forms and submit evaluations.

#### 2.2.6. Training & Development

*   The system shall allow employees to apply for training programs online.
*   The system shall track training history and certifications per employee.

#### 2.2.7. Organizational Structure Management

*   The system shall allow HR staff to manage the organizational structure, including Colleges, Departments, Sections, and Job Titles.
*   The system shall allow department heads to assign teaching loads per semester and track completion.

#### 2.2.8. Disciplinary Management

*   The system shall support disciplinary case management, including case creation, investigation logs, warning letters, and appeal tracking.

#### 2.2.9. Document Management

*   The system shall provide a document management module where users can upload and retrieve official files (e.g., appointment letters, degree certificates, promotion letters).

#### 2.2.10. Reporting & Predictive Analytics

*   The system shall allow HR administrators to generate standardized reports including:
    *   Headcount by department
    *   Staff qualification distribution (BSc, MSc, PhD)
    *   Leave consumption summary
    *   Employee turnover rate
    *   Teaching load per department
*   The system shall provide **predictive workforce analytics** dashboards displaying:
    *   Staffing trend forecasts
    *   Turnover risk indicators
    *   AI-generated strategic recommendations

### 2.3. Non-Functional Requirements

Non-functional requirements define how the HRMS will perform its functions in terms of reliability, security, usability, and maintainability.

#### 2.3.1. Performance

*   The system shall load employee profiles, leave forms, and reports in under 2 seconds under normal campus internet conditions (≥2 Mbps).
*   The system shall support up to 100 concurrent users (e.g., during appraisal season) without noticeable slowdown.
*   AI-driven candidate matching and predictive analytics shall return results within 5 seconds for datasets up to 1,000 employees.

#### 2.3.2. Security

*   The system shall use JWT (JSON Web Tokens) for secure authentication and session management.
*   All passwords shall be encrypted using industry-standard hashing algorithms (bcrypt).
*   The system shall enforce role-based access control to prevent unauthorized data access.
*   All data transmissions shall be encrypted using HTTPS/TLS protocols.

#### 2.3.3. Usability

*   The system shall provide a responsive web interface accessible on desktops, tablets, and smartphones.
*   The user interface shall follow intuitive navigation patterns requiring minimal training.
*   The system shall provide clear error messages and validation feedback.

#### 2.3.4. Reliability

*   The system shall maintain 99% uptime during campus working hours (8:00 AM – 6:00 PM, Monday–Friday).
*   The system shall implement automatic database backups on a daily basis.

#### 2.3.5. Maintainability

*   The system shall be built using modular architecture, allowing easy updates and feature additions.
*   All code shall be documented and follow consistent coding standards.
*   AI components shall use lightweight statistical libraries (e.g., simple-statistics) that do not require specialized ML infrastructure.

#### 2.3.6. Scalability

*   The system architecture shall support future expansion to additional UOG campuses if required.
*   The database design shall accommodate growth to 5,000+ employee records without performance degradation.

#### 2.3.7. Availability

*   The system shall be accessible during official working hours (8:00 AM – 6:00 PM, Monday to Friday) with minimal downtime.
*   Full 24/7 availability is not required, as HR operations are office-hour based.
*   Scheduled maintenance windows shall be communicated to users at least 24 hours in advance.

#### 2.3.8. Environmental

*   The system shall operate reliably on standard campus infrastructure: personal laptops (8GB RAM, SSD), shared Wi-Fi, and mobile hotspot internet.
*   The system shall be resilient to intermittent connectivity (e.g., auto-save draft forms, graceful error handling).
*   No specialized hardware (e.g., biometric scanners) shall be assumed for core functionality.
*   AI features shall run on standard server hardware without GPU requirements.

#### 2.3.9. Usability

*   The user interface shall be intuitive and simple, requiring less than one hour of training for non-technical users (e.g., department secretaries).
*   Forms shall include clear labels, input validation, and helpful tooltips where applicable.
*   The design shall follow responsive web principles to work on desktops, tablets, and smartphones.
*   AI recommendations (e.g., candidate match scores) shall be displayed with clear explanations to support user understanding.

#### 2.3.10. Compatibility

*   The system shall be fully compatible with modern web browsers used at UOG, including:
    *   Google Chrome
    *   Mozilla Firefox
    *   Microsoft Edge
*   The system shall not require browser plugins or proprietary software.
*   The system shall function correctly on both Windows and macOS operating systems.

#### 2.3.11. Data Integrity

*   Critical operations (e.g., leave submission, document upload) shall be transactional—either fully completed or rolled back.
*   The system shall prevent duplicate submissions through request deduplication mechanisms.
*   AI-generated recommendations shall be logged with timestamps for audit trail purposes.

---

This comprehensive set of functional and non-functional requirements ensures the **UOG Tede Campus HRMS** will be practical, secure, user-friendly, and aligned with the operational realities of the University of Gondar – Tede Campus. The integration of AI-driven features (candidate matching and predictive analytics) is designed to enhance decision-making while maintaining realistic technical constraints suitable for the campus environment.




