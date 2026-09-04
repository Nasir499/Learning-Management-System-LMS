import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LMS Platform - Comprehensive Project Overview & Interview Guide</title>
    <style>
        @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {
                content: counter(page);
            }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-size: 13px;
        }

        /* Header / Banner */
        .cover {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%);
            color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .cover h1 {
            font-size: 26px;
            margin: 0 0 8px 0;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #ffffff;
        }

        .cover .subtitle {
            font-size: 15px;
            color: #93c5fd;
            margin-bottom: 15px;
            font-weight: 500;
        }

        .meta-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
        }

        .tag {
            background-color: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(4px);
            color: #f8fafc;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Section Headings */
        h2 {
            color: #0f172a;
            font-size: 18px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 6px;
            margin-top: 30px;
            margin-bottom: 15px;
            font-weight: 700;
        }

        h3 {
            color: #1e40af;
            font-size: 15px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        /* Callout Boxes */
        .callout {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            margin: 15px 0;
            font-size: 12.5px;
        }

        .callout-title {
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 4px;
        }

        .callout-warning {
            background-color: #fffbeb;
            border-left-color: #f59e0b;
        }

        .callout-warning .callout-title {
            color: #b45309;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
        }

        th {
            background-color: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 8px 12px;
            font-weight: 600;
        }

        td {
            padding: 8px 12px;
            border-bottom: 1px solid #e2e8f0;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        /* Code Blocks */
        pre, code {
            font-family: 'Consolas', 'Courier New', Courier, monospace;
        }

        code {
            background-color: #f1f5f9;
            color: #0f172a;
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 11.5px;
        }

        pre {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 11px;
            line-height: 1.4;
        }

        /* Q&A Cards */
        .qa-card {
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            margin-bottom: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            page-break-inside: avoid;
        }

        .qa-header {
            background-color: #f1f5f9;
            padding: 10px 14px;
            border-bottom: 1px solid #cbd5e1;
            font-weight: 700;
            color: #0f172a;
            font-size: 13.5px;
            display: flex;
            align-items: center;
        }

        .qa-badge {
            background-color: #2563eb;
            color: #ffffff;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 8px;
            text-transform: uppercase;
        }

        .qa-body {
            padding: 12px 14px;
            color: #334155;
        }

        .qa-body p {
            margin: 0 0 8px 0;
        }

        .qa-body p:last-child {
            margin-bottom: 0;
        }

        .page-break {
            page-break-before: always;
        }

        ul, ol {
            margin-top: 5px;
            margin-bottom: 10px;
            padding-left: 20px;
        }

        li {
            margin-bottom: 4px;
        }
    </style>
</head>
<body>

    <!-- Cover / Header Banner -->
    <div class="cover">
        <h1>🎓 LMS Platform: Master Interview Guide</h1>
        <div class="subtitle">Complete Technical Architecture & Technical Interview Preparation Handbook</div>
        <div class="meta-tags">
            <span class="tag">MERN Stack</span>
            <span class="tag">React 18 + Vite</span>
            <span class="tag">Redux Toolkit</span>
            <span class="tag">Node.js + Express</span>
            <span class="tag">MongoDB & Mongoose</span>
            <span class="tag">Razorpay Payment Engine</span>
            <span class="tag">Cloudinary Media CDN</span>
            <span class="tag">JWT HTTP-Only Auth</span>
        </div>
    </div>

    <!-- Section 1: Executive Project Description -->
    <h2>1. Executive Project Overview</h2>
    <p>
        The <strong>Learning Management System (LMS) Platform</strong> is a full-stack web application designed to support online education delivery, video streaming, role-based administration, and recurring subscription monetization. It features a responsive React single-page application (SPA) frontend powered by Vite and Redux Toolkit, backed by an Express RESTful API and MongoDB database.
    </p>

    <div class="callout">
        <div class="callout-title">💡 Elevator Pitch Strategy for Interviewers</div>
        "I built a full-stack Learning Management System (LMS) designed for online course hosting and subscription monetization. On the frontend, I used React with Vite for high performance, Redux Toolkit for centralized state management, and Tailwind CSS for dynamic dark-themed UI components. On the backend, I engineered a Node.js and Express REST API with MongoDB/Mongoose. Key highlights include HTTP-Only cookie-based JWT authentication, role and subscription access control middlewares, Razorpay subscription processing with HMAC SHA-256 signature verification, Cloudinary chunked media streaming, and an Admin analytics dashboard powered by Chart.js."
    </div>

    <h3>Tech Stack Breakdown</h3>
    <table>
        <thead>
            <tr>
                <th>Layer</th>
                <th>Technologies Used</th>
                <th>Role & Architectural Purpose</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Frontend</strong></td>
                <td>React 18, Vite, Tailwind CSS, DaisyUI</td>
                <td>Fast SPA rendering, modern UI styling, responsive design.</td>
            </tr>
            <tr>
                <td><strong>State & Routing</strong></td>
                <td>Redux Toolkit, React Router DOM v6</td>
                <td>Global state slices (auth, course, lecture, razorpay, stat), role routing.</td>
            </tr>
            <tr>
                <td><strong>Backend API</strong></td>
                <td>Node.js, Express.js</td>
                <td>REST API controller pattern, middleware pipeline, CORS setup.</td>
            </tr>
            <tr>
                <td><strong>Database</strong></td>
                <td>MongoDB, Mongoose ORM</td>
                <td>NoSQL document database, schema validation, pre-save hooks.</td>
            </tr>
            <tr>
                <td><strong>Authentication</strong></td>
                <td>JWT (HTTP-Only Cookies), Bcrypt.js, Crypto</td>
                <td>Secure authentication tokens, salted password hashing, password reset tokens.</td>
            </tr>
            <tr>
                <td><strong>Payment Gateway</strong></td>
                <td>Razorpay API, Webhooks</td>
                <td>Subscription plans, HMAC-SHA256 signature verification, billing event hooks.</td>
            </tr>
            <tr>
                <td><strong>Media Storage</strong></td>
                <td>Multer, Cloudinary SDK</td>
                <td>Local disk buffer upload, 6MB chunked upload (`upload_large`) for HD video.</td>
            </tr>
            <tr>
                <td><strong>Security & Utilities</strong></td>
                <td>express-rate-limit, Nodemailer, Morgan</td>
                <td>IP brute-force protection (20 req/15 min), transaction emails, dev logging.</td>
            </tr>
        </tbody>
    </table>

    <h3>System Architecture & Data Workflow</h3>
    <pre>
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 REACT FRONTEND                                  │
│  React (Vite) + Redux Toolkit + Axios (withCredentials: true) + React Router    │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ REST API Requests (Cookies Included)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 EXPRESS BACKEND                                 │
│  Middlewares: rateLimit -> cookieParser -> isLoggedIn -> authorizedRoles        │
│                -> authorizedSubscriber -> errorMiddleware                       │
└──────────────┬────────────────────────┬────────────────────────┬────────────────┘
               │                        │                        │
               ▼                        ▼                        ▼
     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
     │ MongoDB Database │     │ Cloudinary CDN   │     │ Razorpay Gateway │
     │ (User, Course,   │     │ (Chunked Video & │     │ (Subscriptions & │
     │  Payment Schemas)│     │  Avatars)        │     │  Webhooks)       │
     └──────────────────┘     └──────────────────┘     └──────────────────┘
    </pre>

    <!-- Page Break for Clean Layout -->
    <div class="page-break"></div>

    <h2>2. Key Functional Modules & Technical Nuances</h2>

    <h3>A. Authentication & Security Engine</h3>
    <ul>
        <li><strong>HTTP-Only Cookie Token Storage:</strong> Access tokens are issued with <code>httpOnly: true</code>, <code>secure: process.env.NODE_ENV === 'production'</code>, and a 7-day expiration duration, eliminating client-side XSS access to tokens.</li>
        <li><strong>Bcrypt Password Hashing:</strong> Mongoose <code>pre('save')</code> hook automatically hashes user passwords using salt rounds = 10 when modified. Passwords are set with <code>select: false</code> in schemas to avoid accidental leaks in database queries.</li>
        <li><strong>Crypto Reset Tokens:</strong> Password reset link uses Node's native <code>crypto.randomBytes(20)</code>. Only an SHA-256 hash of the token is saved to the database (expires in 5 minutes), while the unhashed token is emailed to the user.</li>
        <li><strong>IP Rate Limiting:</strong> Endpoints like <code>/login</code>, <code>/register</code>, and <code>/forgot</code> are protected with <code>express-rate-limit</code> to limit abuse to 20 attempts per 15 minutes per IP address.</li>
    </ul>

    <h3>B. Authorization & Protected Routes (RBAC & Subscription Guard)</h3>
    <ul>
        <li><strong><code>isLoggedIn</code> Middleware:</strong> Decodes and validates JWT tokens from cookies using <code>jwt.verify()</code>.</li>
        <li><strong><code>authorizedRoles('ADMIN')</code> Middleware:</strong> Restricts route execution to users with the <code>ADMIN</code> role.</li>
        <li><strong><code>authorizedSubscriber</code> Middleware:</strong> Grants lecture video access only if the user is an <code>ADMIN</code> or has an <code>active</code> subscription status.</li>
        <li><strong>Frontend <code>RequireAuth</code> Guard:</strong> Custom React wrapper component inspecting Redux state to enforce role routes and navigate unauthorized users to a <code>/denied</code> route.</li>
    </ul>

    <h3>C. Media Upload & CDN Streaming Pipeline</h3>
    <ul>
        <li><strong>Multer Storage:</strong> Incoming files are temporarily cached on local disk storage under the <code>uploads/</code> directory.</li>
        <li><strong>Cloudinary Chunked Uploads:</strong> Large lecture video files are streamed to Cloudinary using <code>cloudinary.v2.uploader.upload_large()</code> with a <code>chunk_size: 6000000</code> (6MB chunks).</li>
        <li><strong>Disk Cleanup:</strong> After successful CDN upload, temporary files are unlinked using <code>fs.rm()</code>.</li>
    </ul>

    <h3>D. Razorpay Payment & Subscription Engine</h3>
    <ul>
        <li><strong>Subscription Plan Creation:</strong> Users subscribe to an admin-configured subscription plan ID.</li>
        <li><strong>HMAC SHA-256 Signature Verification:</strong> Server verifies subscription payments by hashing <code>razorpay_payment_id|subscription_id</code> with <code>RAZORPAY_SECRET</code>.</li>
        <li><strong>Automated Webhook Sync:</strong> Webhooks catch subscription billing events (e.g., <code>subscription.charged</code>) to maintain accurate billing state asynchronously.</li>
    </ul>

    <h3>E. Admin Analytics & Reporting</h3>
    <ul>
        <li><strong>User Breakdown:</strong> Interactive Pie chart displaying registered vs active subscribed users.</li>
        <li><strong>Revenue Graph:</strong> Interactive Bar chart plotting monthly revenue trends across the current calendar year.</li>
    </ul>

    <!-- Section 3: Interview Q&A -->
    <h2>3. Top Technical & Behavioral Interview Questions</h2>

    <div class="qa-card">
        <div class="qa-header">
            <span class="qa-badge">Security</span> Q1: Why did you use HTTP-Only cookies instead of LocalStorage for JWT tokens?
        </div>
        <div class="qa-body">
            <p><strong>Answer:</strong> Storing JWTs in <code>localStorage</code> or <code>sessionStorage</code> makes them accessible to any client-side JavaScript executing in the browser. If the web application is vulnerable to Cross-Site Scripting (XSS), malicious scripts can easily steal the raw token and impersonate the user.</p>
            <p>By issuing JWTs in <code>httpOnly</code> cookies with <code>secure: true</code> and <code>sameSite</code> flags, client-side scripts cannot read or steal the token. The browser automatically appends the cookie to requests made to the backend domain.</p>
        </div>
    </div>

    <div class="qa-card">
        <div class="qa-header">
            <span class="qa-badge">Payments</span> Q2: How does Razorpay payment verification work in your server?
        </div>
        <div class="qa-body">
            <p><strong>Answer:</strong> Payment verification relies on a cryptographic HMAC-SHA256 checksum:</p>
            <ol>
                <li>The client completes payment via Razorpay SDK and receives <code>razorpay_payment_id</code>, <code>razorpay_subscription_id</code>, and <code>razorpay_payment_signature</code>.</li>
                <li>The server recalculates the signature using Node's <code>crypto</code> module:
                    <code>crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(`${razorpay_payment_id}|${subscriptionId}`).digest('hex')</code>.</li>
                <li>If the generated string matches the incoming signature, the subscription status is updated to <code>active</code> and saved in MongoDB.</li>
            </ol>
        </div>
    </div>

    <div class="qa-card">
        <div class="qa-header">
            <span class="qa-badge">Frontend</span> Q3: How do you maintain authenticated requests with CORS in React + Axios?
        </div>
        <div class="qa-body">
            <p><strong>Answer:</strong> Cross-origin requests do not transmit cookies by default. To enable secure cookie transfer across origins:</p>
            <ul>
                <li><strong>Backend:</strong> In <code>app.js</code>, Express CORS middleware is configured with <code>credentials: true</code> and an explicit <code>origin</code> domain whitelist.</li>
                <li><strong>Frontend:</strong> The global Axios instance is initialized with <code>withCredentials: true</code>.</li>
            </ul>
        </div>
    </div>

    <!-- Page Break -->
    <div class="page-break"></div>

    <div class="qa-card">
        <div class="qa-header">
            <span class="qa-badge">Performance</span> Q4: How do you handle multi-gigabyte video uploads without crashing Node.js?
        </div>
        <div class="qa-body">
            <p><strong>Answer:</strong> Direct memory buffers in Express easily lead to heap out-of-memory errors when processing large video files. I solved this using a two-stage streaming upload process:</p>
            <ol>
                <li><strong>Multer Disk Caching:</strong> Multer streams incoming binary video streams directly onto the disk inside a temporary <code>uploads/</code> directory instead of loading the entire file into Node RAM.</li>
                <li><strong>Cloudinary Chunked Uploads:</strong> I implemented Cloudinary's <code>upload_large</code> API with a 6MB chunk size (<code>chunk_size: 6000000</code>). Cloudinary reads and uploads the file in small chunks.</li>
                <li><strong>Cleanup:</strong> Once uploaded, <code>fs.rm()</code> removes the local disk buffer.</li>
            </ol>
        </div>
    </div>

    <div class="qa-card">
        <div class="qa-header">
            <span class="qa-badge">System Scaling</span> Q5: How would you scale this platform to support 100,000 active students?
        </div>
        <div class="qa-body">
            <p><strong>Answer:</strong> To scale the architecture seamlessly:</p>
            <ul>
                <li><strong>HLS Video Streaming:</strong> Convert MP4 videos to HLS (HTTP Live Streaming) format with adaptive bitrates delivered via an edge CDN (AWS CloudFront / Cloudinary).</li>
                <li><strong>Caching Layer:</strong> Deploy a <strong>Redis</strong> cluster to cache user profile sessions, subscription statuses, and course catalog metadata to minimize database hits.</li>
                <li><strong>Stateless Horizontally Scaled Microservices:</strong> Because JWT auth is stateless, backend Express containers can run in Kubernetes behind an AWS Application Load Balancer (ALB).</li>
                <li><strong>Database Optimization:</strong> Create indexes on <code>email</code>, <code>role</code>, and <code>subscription.status</code>, and introduce MongoDB read-replicas or sharding by <code>userId</code>.</li>
            </ul>
        </div>
    </div>

    <div class="qa-card">
        <div class="qa-header">
            <span class="qa-badge">Behavioral</span> Q6: What was a major bug you encountered and how did you debug it?
        </div>
        <div class="qa-body">
            <p><strong>Answer:</strong> A key bug occurred when subscribed users were redirected back to the login page after purchasing a subscription. The issue was that the original JWT token stored in the cookie contained the stale <code>subscription.status = 'inactive'</code> payload. Even though MongoDB updated to <code>active</code>, the client's cookie held the old token.</p>
            <p><strong>Fix:</strong> Inside the <code>verifySubscription</code> controller, after saving the updated user document to MongoDB, I generated a fresh JWT token with the new subscription status and re-issued the HTTP cookie before returning the success response.</p>
        </div>
    </div>

    <!-- Section 4: 10-Minute Rapid Recall Cheat Sheet -->
    <h2>4. ⚡ 10-Minute Pre-Interview Rapid Recall Cheat Sheet</h2>
    
    <div class="callout callout-warning">
        <div class="callout-title">🚀 Last-Minute Memory Refresh</div>
        Review these bullet points 10 minutes prior to your interview call:
    </div>

    <ul>
        <li><strong>Frontend Stack:</strong> React 18, Vite, Redux Toolkit, Tailwind CSS, DaisyUI, React Router v6, Chart.js.</li>
        <li><strong>Backend Stack:</strong> Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Multer, Nodemailer.</li>
        <li><strong>Auth Strategy:</strong> HTTP-Only Cookies + JWT + Bcrypt (salt rounds=10) + Rate Limiting (`express-rate-limit`).</li>
        <li><strong>Password Reset:</strong> Raw random token via email, SHA-256 token stored in DB with 5-minute expiration timestamp.</li>
        <li><strong>Access Control:</strong> <code>isLoggedIn</code> $\rightarrow$ <code>authorizedRoles('ADMIN')</code> $\rightarrow$ <code>authorizedSubscriber</code>.</li>
        <li><strong>Razorpay Sync:</strong> HMAC-SHA256 signature verification (<code>razorpay_payment_id|subscription_id</code>) + Razorpay Webhooks.</li>
        <li><strong>Media Storage:</strong> Multer disk caching $\rightarrow$ Cloudinary 6MB chunked upload (<code>upload_large</code>) $\rightarrow$ <code>fs.rm()</code> cleanup.</li>
        <li><strong>Dashboard Analytics:</strong> Chart.js Pie chart (users) & Bar chart (monthly sales revenue).</li>
    </ul>

</body>
</html>
"""

html_path = r"d:\LMS-E\LMS_Interview_Guide.html"
pdf_path = r"d:\LMS-E\LMS_Project_Overview_and_Interview_Guide.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML generated at:", html_path)

# Convert to PDF using Microsoft Edge headless
edge_cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]

result = subprocess.run(edge_cmd, capture_output=True, text=True)
if os.path.exists(pdf_path):
    print("PDF generated successfully at:", pdf_path)
else:
    print("PDF generation failed:", result.stderr)
