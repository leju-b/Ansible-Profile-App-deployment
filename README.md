# Node.js App with AWS RDS and S3 Integration

## Overview

This project demonstrates the deployment of a Node.js application that interacts with AWS RDS for database storage and S3 for file storage. The app allows users to upload their ID, name, and profile picture, which are then stored in the RDS database and S3 bucket. The project is automated using Ansible, ensuring a smooth and repeatable deployment process across multiple instances.
[complete documentation](/blob/main/Deploying_Nodejs_App_on_AWS_EC2_Ubuntu_Instance_using_ansible.pdf)
## Features

- **Node.js Application**: A simple app built with Node.js, Express, and MySQL, allowing users to upload data and images.
- **AWS Integration**: The app is integrated with AWS RDS for MySQL database storage and S3 for storing profile pictures.
- **Environment Configuration**: Sensitive information like database credentials and AWS access keys are securely managed using an `.env` file.
- **Automated Deployment**: Ansible is used to automate the setup and deployment process, including server provisioning, environment setup, application deployment, and service management using PM2 and NGINX.

## Prerequisites

- AWS Account with permissions to create and manage EC2, RDS, and S3 resources.
- Ansible installed on the master instance or local machine.
- Node.js and NPM installed on the target instance.
- A GitHub account.

## Setup and Deployment

### 1. Fork and Clone the Repository

First, fork this repository to your own GitHub account to avoid access key issues during the cloning process. Then, clone your forked repository to your EC2 instance.

```bash
git clone https://github.com/YOUR-USERNAME/Profile-App.git
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### 2. Environment Configuration

Create a `.env` file in the root directory of the project to store your AWS credentials and database details.

```env
DB_HOST=your-rds-endpoint
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
S3_BUCKET=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
```

### 3. Ansible Setup

#### Inventory File

Add the IP address and user of the target instance to the `inventory` file.

```ini
[target]
your-ec2-instance-ip ansible_user=ubuntu
```

Replace `your-ec2-instance-ip` with the public IP of your target EC2 instance.

#### Ansible Roles

The project includes several Ansible roles, each responsible for different parts of the setup:

- **Common**: Installs Node.js, Git, and NGINX on the target instance.
- **Deploy**: Clones the repository, installs dependencies, and prepares the app for deployment.
- **Env**: Creates the `.env` file on the target instance with the necessary credentials.
- **NGINX**: Configures NGINX as a reverse proxy for the Node.js application.
- **SQL**: Sets up the MySQL database on AWS RDS, including the necessary tables.
- **PM2**: Manages the Node.js application using PM2 and configures it to start on system boot.

### 4. Running Ansible Playbooks

Run the Ansible playbooks to set up and deploy the application on the target instance.

```bash
ansible-playbook -i inventory site.yml
```

### 5. Access the Application

Once the playbooks have been executed successfully, you can access the application by navigating to the public IP address of your EC2 instance in a web browser.

### 6. Troubleshooting

If you encounter any issues during deployment, consider the following:

- Ensure the EC2 instance has the necessary IAM roles to interact with AWS services.
- Verify the security group settings to allow traffic on port 80 (HTTP) and 22 (SSH).
- Check the `.env` file for any incorrect or missing credentials.
- Review the Ansible playbook output for any error messages and adjust the roles or configuration as needed.

## Conclusion

This project provides a complete setup for deploying a Node.js application with AWS RDS and S3 integration, automated through Ansible. Follow the instructions to configure and deploy the app, and refer to the troubleshooting section if issues arise.

---

Replace placeholders like `YOUR-USERNAME` and `your-ec2-instance-ip` with your specific details. Adjust any instructions based on your actual setup and requirements.
