# BlogNarrative

BlogNarrative is a dynamic and user-friendly web application designed to empower multiple authors to create, manage, and share their blog posts with ease. With BlogNarrative, authors can effortlessly compose, edit, and delete their posts, while readers can engage with the content through comments and likes.

## Key Features

- **User Registration and Authentication:** Users can sign up for an account using their email address and password. Once registered, users can log in to the application to access the features.
- **Post Management:** Authors can easily create new blog posts, edit existing ones, and delete posts when necessary. The application offers a clean and intuitive interface for managing blog content
- **Comments and Likes:** Readers can actively participate in discussions by commenting on blog posts and expressing their appreciation through likes. The application provides a seamless commenting system and displays the number of likes for each post.
- **Image Upload:** BlogNarrative allows authors to enhance their posts by uploading relevant images. This visual element adds depth and interest to the blog content.
- **Powerful Search Functionality:** Finding specific blog posts is a breeze with BlogNarrative's robust search feature. Users can quickly locate posts based on keywords, making it easy to navigate through the content.
- **Responsive Design:** The application is built with a responsive UI, ensuring that it looks great and functions seamlessly across various devices, including desktops, tablets, and mobile phones.
- **Password Recovery:** In case users forget their passwords, BlogNarrative offers a convenient password recovery system. Users can request a password reset link via email, providing a secure way to regain access to their accounts.
- **User Profile Management:** Authors can personalize their profiles by updating their information and preferences. This allows them to showcase their unique identities within the BlogNarrative community.

## Technology Stack

BlogNarrative is built using a modern technology stack to ensure performance, scalability, and maintainability:

- **Backend:** The server-side logic is powered by Node.js and Express.js, providing a robust and efficient foundation for the application. PostgreSQL is used as the database to store and manage blog data securely.
- **Frontend:** The user interface is crafted using HTML, CSS, and Bootstrap, resulting in a visually appealing and responsive design. Vanilla JavaScript is employed to enhance interactivity and deliver a smooth user experience.
- **Authentication:** JSON Web Tokens (JWT) are utilized for secure user authentication, ensuring that only authorized users can access protected routes and perform specific actions.
- **Password Security:** User passwords are hashed using bcrypt, a powerful hashing algorithm, to protect sensitive information and maintain user privacy.
- **Email Notifications:** Nodemailer is integrated to send email notifications for password recovery, keeping users informed and providing a seamless experience.
- **Image Handling:** Multer is used to handle image uploads efficiently, allowing authors to include visual content in their blog posts.

---

## [BlogNarrtive -Hosted Version](https://blogapp-efkc.onrender.com/)

# Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- NPM (latest is always recommended)
- PostgreSQL (version 10 or higher)

### Installation

Clone the repository:

```
git clone https://github.com/SanjayKhatiChhetri/blognarrative.git
```

Navigate to the project directory:

```
cd blognarrative
```

Install the dependencies:

```
npm install
```

Set up the database & environment variables:

Create a new PostgreSQL database for the application
Update the database connection details in the `config/db.js` file. `schema.sql` file is provided in the root directory to create the required tables in the database.

Create a new file named `.env` in the project directory
Add the following environment variables to the `.env` file:

```
#Database connection details
process.env.USERNAME = USERNAME
process.env.PASSWORD = PASSWORD
process.env.DATABASE = DB_NAME
process.env.HOST = localhost
process.env.PORT = 5432

#NodeMailer for password recovery
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=16_DIGIT_PASSWORD

#JWT secret key
JWT_SECRET = your_secret_key
```

- Replace `USERNAME`, `PASSWORD`, and `DB_NAME` with your PostgreSQL username, password, and database name respectively
- Replace `YOUR_EMAIL` and `16_DIGIT_PASSWORD` with your email and password for sending password recovery emails. Use Gmail App Password:
  Instead of your regular Gmail password, you need to use an App Password. Here's how to set it up:
  - a. Go to your Google Account settings (https://myaccount.google.com/).
  - b. Select "Security" on the left.
  - c. Under "Signing in to Google," select "2-Step Verification" and make sure it's turned on.
  - d. Go back to the Security page, and you should now see "App passwords" under the "2-Step Verification" section.
  - e. Select "App passwords".
  - f. At the bottom, choose "Select app" and pick "Mail" or "Other (Custom name)" and enter "Nodemailer".
  - g. Click "Generate".
  - h. Google will generate a 16-character password. Copy this password.
    helpful link: [Sign in with app passwords](https://support.google.com/accounts/answer/185833?hl=en). In https://myaccount.google.com/security, do you see 2-step verification set to ON? If yes, then visiting https://myaccount.google.com/apppasswords should allow you to set up application specific passwords.

Start the application:

```
npm start
```

Access the application in your web browser at `http://localhost:3000`

### Project Structure

- `server/`: Contains the server-side code
  - `config/`: Configuration files
  - `controllers/`: Controller functions for handling requests
  - `middleware/`: Middleware functions
  - `models/`: Data models and database queries
  - `routes/`: API routes
  - `utils/`: Utility functions
- `public/`: Contains the client-side code and assets
  - `css/:` CSS stylesheets
  - `js/`: JavaScript files
  - `images/`: Image files
  - `index.html`: The main HTML file for the application
- `package.json`: Project dependencies and scripts
- `README.md`: Project documentation

### Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please [open an issue](https://github.com/SanjayKhatiChhetri/BlogNarrative/issues) or [submit a pull request](https://github.com/SanjayKhatiChhetri/BlogNarrative/pulls).

### License

This project is licensed under the MIT License. See the LICENSE file for more information.
Contact
If you have any questions or inquiries, please contact Sanjay Khati Chhetri, social can be found at `https://github.com/SanjayKhatiChhetri` under `Where to find me` section.

# What is this project about?

                         --**** SUMMER PROJECT SPRING 2024***--

---

## Creating example web applicatio.

Objective for the project is to create an example web application for project course at Oulu university of Applied Sciences(OAMK). Developed app will be used as an example for an assignment and target
audience is first year students doing their first project course. This Project course is 15 credits containing both development work and project management.

## Features

Developed example app should be a social media app/forum/blog wher users are able
to make posts, comment and like them. Following page contains list of all the features
that must be included. It also contains points that will be used when evaluating returned
assignments.

Developed web application should be blog with multiple authors (same blog contains
posts from multiple different users). Topic (what website is about) is free/open.

| Name                                                                           | Description                                                                                                                                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Responsive UI                                                                  | UI is scaling into different screen sizes (mobile, tablet or wider). Bootstrap is used to create layout and basic styling.                                              |
| Appearance                                                                     | UI should follow good design principles. There should be enough whitespace. The use of colours and fonts should be considered.                                          |
| Registration                                                                   | User must be able to sign up to the app using email address and password.                                                                                               |
| Login                                                                          | User should be able to login to the app by using email address and password created during sign up.                                                                     |
| Displaying posts                                                               | Web site should display posts. Post contains title, description, date, and author. Author is logged in user, who has created the post. Posts are visible for all users. |
| Adding posts                                                                   | Logged user should be able to add posts. Author is logged user and date is automatically generated by the database.                                                     |
| Adding comments                                                                | Logged user is able add comment for a post. Author is logged user and comment contains text and date generated by the database.                                         |
| Displaying comments                                                            | Comment count for a post is displayed in connection with other post information and a modal window is used to display comments (text, date and author).                 |
| Like                                                                           | User can like a post. Likes are displayed in connection with other post information using stars (icons/images) and calculated average (number).                         |
| Adding image for a post                                                        | User can add an image for a post. Form data is used to send (binary) data from frontend to backend. Image file is saved on backend under public/image folder.           |
| Displaying post image                                                          | Saved post image is displayed in connection with the post.                                                                                                              |
| Deleting posts                                                                 | Logged user can delete own posts. All data related to posts (e.g. comments) are also deleted.                                                                           |
| Editing posts                                                                  | Logged user can edit own posts.                                                                                                                                         |
| Deleting comment                                                               | Logged user can delete own comments.                                                                                                                                    |
| Editing comment                                                                | Logged user can edit own comments                                                                                                                                       |
| Search/Filtering                                                               | User can search/filter displayed posts.                                                                                                                                 |
| Encrypting password                                                            | Password is encrypted in database.                                                                                                                                      |
| Authentication token                                                           | Authentication token (JWT) is used to protect all endpoints that requires user to be logged in.                                                                         |
| Password recovery (NodeMail link with recovery link and related functionality) | User can recover password by requesting link to email. Link opens a page where password can be changed.                                                                 |
| Static content                                                                 | Web site should contain at least one static html page.                                                                                                                  |

## Technology

Technologies for the web application are as follows.

- UI is implemented using HTML, CSS and Bootstrap
- Front-end software logic/functionality is implemented using Vanilla JavaScript,
  no framework is allowed
- Backend is developed using NodeJS and Express. Database connection is
  implemented using pg library with async interface. Other possible libraries can
  be installed (e.g. Nodemon, Cors, etc.)
- Database is PostgreSQL

## Requirements

Web application (both front-end and backend) needs to be well-structured and commented. For the backend separate routes, files for handling database activities and middleware for handling authentication and errors are implemented. Front-end should make use of object-orientation. All code is stored into Github repository with descriptive readme file. While considering technical solutions, keep in mind, that example application is used to teach first year students with limited previous knowledge or skills. Therefore, used solutions should be relatively simple.
