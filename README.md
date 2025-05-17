# Bussiness Mangament & Hospital Managment System

The Hospital & Business Management System is a comprehensive Android application that provides dedicated tools for managing healthcare facilities and business operations. Developed in Kotlin using Android Studio, this system offers robust solutions for the administrative needs of both hospitals and businesses.

## Features
- Hospital Registration Easily register healthcare facilities with detailed information
- Patient Appointment System View and manage patient appointments
- Doctor Scheduling Create and manage doctor availability timeslots
- Staff Management Add, edit, and remove doctors and nurses
- Business Registration Register businesses with type, name, contact information, and location
- Comprehensive Payroll System Manage employee compensation, track hours worked, and automate calculations

## Technologies Used
- **Core Technologies**:
  - Development Environment Android Studio
  - Programming Language Kotlin
  - Backend Service Firebase (Authentication, Firestore)
  - Architecture MVVM (Model-View-ViewModel)
  - State Management Firebase Realtime Database

## Installation

### Prerequisites
- React native version 0.0.1
- yarn install
- set the JDK enviroment setup in window

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/subhan8799/bussiness_managment.git
   cd bussiness_managment

2. Check the npx structure created
  npx react-native doctor

## Project Structure
  app/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── activities/       
│   │   │   ├── adapters/        
│   │   │   ├── fragments/    
│   │   │   │   ├── business/     
│   │   │   │   ├── Patient/      
│   │   │   ├── models/           
│   │   │   ├── services/        
│   │   │   ├── utils/            
│   │   │   └── viewmodels/       
│   │   └── res/                  
│   └── test/                 
└── build.gradle                  
## Usage

 ### Add Firebase SDK to your project  
  - Make sure your project-level build.gradle includes the Google services plugin:
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

## Testing
- Android Emulator (Pixel 6, API 33)
- Physical Android Device (Samsung A32)
## Test cases cover
- User authentication flows
- Business and hospital registration
- Employee and staff management
- Appointment booking and scheduling
- Payroll processing

## Contact

For any questions or suggestions, feel free to contact:

**Name**: Abdul Subhan  
**Email**: [Abdul Subhan Email](mian8799@gmail.com)
**GitHub**: [subhan8799](https://github.com/subhan8799)
