import React, { useState, useEffect } from 'react';
import { CurrentUser, StudentProfile, BodyMeasurement } from './types/fitness';
import {
  getStoredStudents,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  addStudent,
  addMeasurementToStudent,
  addPostureSessionToStudent,
} from './services/storageService';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminStudentList from './components/AdminStudentList';
import StudentDetailView from './components/StudentDetailView';
import StudentPortal from './components/StudentPortal';
import CenterAnalytics from './components/CenterAnalytics';
import PostureModule from './components/PostureModule';
import { AnalysisResult } from './services/geminiService';

export default function App() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  
  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'admin-students' | 'student-profile' | 'workout-ai' | 'analytics'>('admin-students');
  
  // Selected student in Admin view
  const [adminSelectedStudentId, setAdminSelectedStudentId] = useState<string | null>(null);

  // Active workout AI modal/view
  const [activeWorkout, setActiveWorkout] = useState<{
    exercise: 'squat' | 'lunges' | 'core';
    studentId: string;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedStudents = getStoredStudents();
    setStudents(loadedStudents);

    const savedUser = getStoredCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      if (savedUser.role === 'student') {
        setCurrentTab('student-profile');
      } else {
        setCurrentTab('admin-students');
      }
    }
  }, []);

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentTab('admin-students');
      setAdminSelectedStudentId(null);
    } else {
      setCurrentTab('student-profile');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredCurrentUser(null);
    setAdminSelectedStudentId(null);
    setActiveWorkout(null);
  };

  const handleSwitchUser = (user: CurrentUser) => {
    handleLogin(user);
  };

  // Add new student (Admin)
  const handleAddStudent = (
    studentData: Omit<StudentProfile, 'id' | 'measurements' | 'postureHistory'>,
    initialMeasurement?: any
  ) => {
    const created = addStudent(studentData, initialMeasurement);
    setStudents(getStoredStudents());
    setAdminSelectedStudentId(created.id);
  };

  // Add new body measurement to student
  const handleSaveMeasurement = (
    studentId: string,
    measurement: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>
  ) => {
    addMeasurementToStudent(studentId, measurement);
    setStudents(getStoredStudents());
  };

  // Start Exercise AI
  const handleStartExerciseAI = (
    exerciseType: 'squat' | 'lunges' | 'core',
    studentId: string
  ) => {
    setActiveWorkout({
      exercise: exerciseType,
      studentId,
    });
  };

  // Save AI workout result into student history
  const handleSaveAIResult = (result: AnalysisResult, exerciseType: 'squat' | 'lunges' | 'core') => {
    if (!activeWorkout) return;
    
    addPostureSessionToStudent(activeWorkout.studentId, {
      date: new Date().toISOString().split('T')[0],
      exerciseType,
      score: result.score,
      reps: result.reps,
      kneeAngle: result.kneeAngle,
      balance: result.balance,
      feedback: result.feedback,
      errors: result.errors,
    });

    setStudents(getStoredStudents());
  };

  // If not logged in
  if (!currentUser) {
    return <Login students={students} onLogin={handleLogin} />;
  }

  // Active AI Posture Workout View
  if (activeWorkout) {
    const targetStudent = students.find((s) => s.id === activeWorkout.studentId);
    return (
      <PostureModule
        type={activeWorkout.exercise}
        student={targetStudent}
        onBack={() => setActiveWorkout(null)}
        onSaveResult={handleSaveAIResult}
        onChangeExercise={(ex) =>
          setActiveWorkout({ exercise: ex, studentId: activeWorkout.studentId })
        }
      />
    );
  }

  // Current logged in Student Profile (for student role)
  const loggedInStudent = currentUser.studentId
    ? students.find((s) => s.id === currentUser.studentId) || students[0]
    : students[0];

  return (
    <div className="min-h-screen bg-[#0B192C] flex flex-col">
      {/* Universal Top Header */}
      <Navbar
        currentUser={currentUser}
        students={students}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        currentTab={currentTab}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setAdminSelectedStudentId(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentUser.role === 'admin' ? (
          /* ADMIN ROLE VIEWS */
          adminSelectedStudentId ? (
            /* Admin viewing specific student's full body dossier */
            (() => {
              const selectedSt = students.find((s) => s.id === adminSelectedStudentId);
              if (!selectedSt) {
                setAdminSelectedStudentId(null);
                return null;
              }
              return (
                <StudentDetailView
                  student={selectedSt}
                  onBack={() => setAdminSelectedStudentId(null)}
                  onSaveMeasurement={handleSaveMeasurement}
                  onStartExerciseAI={handleStartExerciseAI}
                  canManageAllStudents={true}
                />
              );
            })()
          ) : currentTab === 'analytics' ? (
            /* Admin viewing center-wide statistics */
            <CenterAnalytics students={students} />
          ) : (
            /* Admin viewing student directory */
            <AdminStudentList
              students={students}
              onSelectStudent={(id) => setAdminSelectedStudentId(id)}
              onAddStudent={handleAddStudent}
              onSaveMeasurement={handleSaveMeasurement}
              onStartExerciseAI={handleStartExerciseAI}
            />
          )
        ) : (
          /* STUDENT ROLE VIEW (CHỈ XEM ĐƯỢC CỦA CHÍNH MÌNH) */
          loggedInStudent ? (
            <StudentPortal
              student={loggedInStudent}
              onSaveMeasurement={handleSaveMeasurement}
              onStartExerciseAI={handleStartExerciseAI}
            />
          ) : (
            <div className="p-8 text-center text-white">
              Không tìm thấy hồ sơ học viên. Vui lòng liên hệ HLV quản lý.
            </div>
          )
        )}
      </main>
    </div>
  );
}
