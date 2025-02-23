import React from 'react';
import { User } from 'lucide-react';

const StudentDashboard = () => {
  // Mock data for courses
  const userCourses = [
    { id: 1, name: "EAMCET" },
    { id: 2, name: "Class 8" },
    { id: 3, name: "Python" },
  ];

  const trendingCourses = [
    { id: 1, name: "ECET" },
    { id: 2, name: "JEE Mains" },
    { id: 3, name: "Class 10" },
    { id: 4, name: "Java" },
  ];

  return (
    <div className="min-h-screen bg-black text-cyan-50">
      {/* Header */}
      <header className="bg-blue-300 px-10 py-4 shadow-lg relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/api/placeholder/100/100" alt="VBest Logo" className="w-24" />
          </div>
          <div className="flex items-center gap-5">
            <nav>
              <ul className="flex gap-5">
                <li><a href="#" className="text-blue-900 font-bold hover:text-blue-200">Home</a></li>
                <li><a href="#" className="text-blue-900 font-bold hover:text-blue-200">EAMCET</a></li>
                <li><a href="#" className="text-blue-900 font-bold hover:text-blue-200">ECET</a></li>
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              <User className="w-10 h-10 text-blue-900" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-20 py-8">
        {/* Dashboard Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white uppercase animate-fadeIn">
            VDASHBOARD
          </h1>
        </div>

        {/* Welcome Message */}
        <div className="mb-12">
          <h2 className="text-2xl text-blue-300">Welcome, John Doe</h2>
        </div>

        {/* Your Courses Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-500 uppercase mb-6">
            Your Courses
          </h2>
          <div className="flex gap-5 flex-wrap">
            {userCourses.map(course => (
              <div
                key={course.id}
                className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-200 rounded-xl flex items-center justify-center cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="text-lg font-bold text-white">{course.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Courses Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-500 uppercase mb-6">
            Trending Courses
          </h2>
          <div className="flex gap-5 flex-wrap">
            {trendingCourses.map(course => (
              <div
                key={course.id}
                className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-200 rounded-xl flex items-center justify-center cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="text-lg font-bold text-white">{course.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-cyan-50 px-20 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-blue-200 mb-4 font-bold">Courses</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-blue-400">6th - 10th Class</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">EAMCET</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">ECET</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-200 mb-4 font-bold">Programming</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Python</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Java</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">C++</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-200 mb-4 font-bold">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-blue-400">FAQs</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Help Center</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-200 mb-4 font-bold">Connect with Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Instagram</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Facebook</a></li>
              <li><a href="#" className="text-blue-100 hover:text-blue-400">Twitter</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;