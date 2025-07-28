"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Users, Target, Clock, Calculator, Star, Phone, Mail, MapPin, Menu, X } from "lucide-react"
import Image from "next/image"

export default function GymWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [bmi, setBmi] = useState<number | null>(null)
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [workouts, setWorkouts] = useState([
    { id: 1, day: "Monday", exercise: "Chest & Triceps", completed: false },
    { id: 2, day: "Tuesday", exercise: "Back & Biceps", completed: false },
    { id: 3, day: "Wednesday", exercise: "Legs & Glutes", completed: true },
    { id: 4, day: "Thursday", exercise: "Shoulders & Abs", completed: false },
    { id: 5, day: "Friday", exercise: "Full Body HIIT", completed: false },
    { id: 6, day: "Saturday", exercise: "Cardio & Core", completed: false },
    { id: 7, day: "Sunday", exercise: "Rest Day", completed: false },
  ])

  // Enhanced workout planner state
  const [monthlyWorkouts, setMonthlyWorkouts] = useState([])
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    date: "",
    type: "",
    duration: "",
  })

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", { month: "long" })
  const currentYear = currentDate.getFullYear()

  // Load workouts from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("gymWorkouts")
    if (savedWorkouts) {
      setMonthlyWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  // Save workouts to localStorage whenever monthlyWorkouts changes
  useEffect(() => {
    localStorage.setItem("gymWorkouts", JSON.stringify(monthlyWorkouts))
  }, [monthlyWorkouts])

  // Generate calendar days for current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const calendarDays = getDaysInMonth(currentDate)

  const addWorkout = () => {
    if (newWorkout.date && newWorkout.type) {
      const workout = {
        id: Date.now(),
        date: newWorkout.date,
        type: newWorkout.type,
        duration: newWorkout.duration || "60",
        completed: false,
      }
      setMonthlyWorkouts([...monthlyWorkouts, workout])
      setNewWorkout({ date: "", type: "", duration: "" })
      setShowAddWorkout(false)
    }
  }

  const deleteWorkout = (id) => {
    setMonthlyWorkouts(monthlyWorkouts.filter((w) => w.id !== id))
  }

  const toggleWorkoutCompletion = (id) => {
    setMonthlyWorkouts(monthlyWorkouts.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w)))
  }

  const getWorkoutsForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return monthlyWorkouts.filter((w) => w.date === dateStr)
  }

  const clearAllWorkouts = () => {
    if (confirm("Are you sure you want to clear all workouts?")) {
      setMonthlyWorkouts([])
    }
  }

  const calculateBMI = () => {
    if (height && weight) {
      const heightInM = Number.parseFloat(height) / 100
      const weightInKg = Number.parseFloat(weight)
      const bmiValue = weightInKg / (heightInM * heightInM)
      setBmi(Math.round(bmiValue * 10) / 10)
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { category: "Normal weight", color: "text-green-600" }
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" }
    return { category: "Obese", color: "text-red-600" }
  }

  const toggleWorkout = (id: number) => {
    setWorkouts(
      workouts.map((workout) => (workout.id === id ? { ...workout, completed: !workout.completed } : workout)),
    )
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-8 w-8 text-purple-400"/>
                <span
                    className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitZone
              </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                <button
                    onClick={() => scrollToSection("home")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  Home
                </button>
                <button
                    onClick={() => scrollToSection("about")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  About
                </button>
                <button
                    onClick={() => scrollToSection("calculator")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  BMI Calculator
                </button>
                <button
                    onClick={() => scrollToSection("workouts")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  Workouts
                </button>
                <button
                    onClick={() => scrollToSection("services")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  Services
                </button>
                <button
                    onClick={() => scrollToSection("equipment")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  Equipment
                </button>
                <button
                    onClick={() => scrollToSection("staff")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  Staff
                </button>
                <button
                    onClick={() => scrollToSection("contact")}
                    className="text-white hover:text-purple-400 transition-colors"
                >
                  Contact
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    <button
                        onClick={() => scrollToSection("home")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      Home
                    </button>
                    <button
                        onClick={() => scrollToSection("about")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      About
                    </button>
                    <button
                        onClick={() => scrollToSection("calculator")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      BMI Calculator
                    </button>
                    <button
                        onClick={() => scrollToSection("workouts")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      Workouts
                    </button>
                    <button
                        onClick={() => scrollToSection("services")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      Services
                    </button>
                    <button
                        onClick={() => scrollToSection("equipment")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      Equipment
                    </button>
                    <button
                        onClick={() => scrollToSection("staff")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      Staff
                    </button>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="block px-3 py-2 text-white hover:text-purple-400 transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>

          {/* Background image */}
          <Image
              src="https://b3327586.smushcdn.com/3327586/wp-content/uploads/2024/05/gb-botanica-gym-link-spaces-slough-1024x683.jpg?lossy=0&strip=1&webp=1"
              alt="Modern Gym Interior with Equipment"
              fill
              className="object-cover"
              priority
          />

          {/* Foreground content */}
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Transform Your Body
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow">
              Join the ultimate fitness experience with state-of-the-art equipment, expert trainers, and a community
              that motivates you to achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-lg"
                  onClick={() => scrollToSection("workouts")}
              >

                Plan Your Workout
              </Button>
              <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg bg-transparent shadow-lg"
                  onClick={() => scrollToSection("services")}
              >
                View Programs
              </Button>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Why Choose FitZone?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We're not just a gym - we're your partner in achieving the best version of yourself.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div
                  className="relative w-fit rounded-xl overflow-hidden bg-gradient-to-tr from-slate-800 via-slate-900 to-slate-800 p-1 shadow-inner">
                <Image
                    src="https://i.imgur.com/lTt4PlX.jpeg"
                    alt="Fit Athletic Woman Training"
                    width={500}
                    height={600}
                    className="rounded-xl object-cover"
                />
              </div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <Dumbbell className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Premium Equipment</h3>
                    <p className="text-gray-300">State-of-the-art machines and free weights for every fitness level.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Expert Trainers</h3>
                    <p className="text-gray-300">Certified professionals to guide you through your fitness journey.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Personalized Programs</h3>
                    <p className="text-gray-300">Customized workout plans tailored to your specific goals.</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>

        {/* BMI Calculator Section */}
        <section id="calculator" className="py-20 bg-gradient-to-l from-slate-900 to-purple-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                BMI Calculator
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Calculate your Body Mass Index to understand your current fitness level.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-400"/>
                    Calculate Your BMI
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter your height and weight to get your BMI score
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-white">
                        Height (cm)
                      </Label>
                      <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-white">
                        Weight (kg)
                      </Label>
                      <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <Button
                      onClick={calculateBMI}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Calculate BMI
                  </Button>

                  {bmi && (
                      <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-3xl font-bold text-white mb-2">{bmi}</div>
                        <div className={`text-lg font-semibold ${getBMICategory(bmi).color}`}>
                          {getBMICategory(bmi).category}
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Monthly Workout Planner */}
        <section id="workouts" className="py-20 bg-gradient-to-r from-purple-900 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Monthly Workout Planner
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Plan and track your monthly fitness routine with our comprehensive workout planner.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-400"/>
                        {currentMonth} {currentYear}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Plan your workouts and track your progress
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                          onClick={() => setShowAddWorkout(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Add Workout
                      </Button>
                      <Button
                          onClick={clearAllWorkouts}
                          variant="outline"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Add Workout Form */}
                  {showAddWorkout && (
                      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-white font-semibold mb-4">Add New Workout</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="workout-date" className="text-white text-sm">
                              Date
                            </Label>
                            <Input
                                id="workout-date"
                                type="date"
                                value={newWorkout.date}
                                onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                                className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="workout-type" className="text-white text-sm">
                              Workout Type
                            </Label>
                            <Input
                                id="workout-type"
                                placeholder="e.g., Chest & Triceps"
                                value={newWorkout.type}
                                onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="workout-duration" className="text-white text-sm">
                              Duration (min)
                            </Label>
                            <Input
                                id="workout-duration"
                                type="number"
                                placeholder="60"
                                value={newWorkout.duration}
                                onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <Button onClick={addWorkout} className="bg-green-600 hover:bg-green-700">
                              Add
                            </Button>
                            <Button
                                onClick={() => setShowAddWorkout(false)}
                                variant="outline"
                                className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Calendar View */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-white font-semibold p-2">
                          {day}
                        </div>
                    ))}
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`min-h-[100px] p-2 border border-white/10 rounded-lg ${
                                day ? "bg-white/5" : "bg-transparent"
                            }`}
                        >
                          {day && (
                              <>
                                <div className="text-white font-semibold mb-1">{day}</div>
                                {getWorkoutsForDay(day).map((workout) => (
                                    <div
                                        key={workout.id}
                                        className={`text-xs p-2 mb-1 rounded cursor-pointer relative ${
                                            workout.completed
                                                ? "bg-green-600/50 text-green-200"
                                                : "bg-purple-600/50 text-purple-200"
                                        }`}
                                        onClick={() => toggleWorkoutCompletion(workout.id)}
                                    >
                                      <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteWorkout(workout.id)
                                          }}
                                          className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-sm font-bold w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20"
                                      >
                                        ×
                                      </button>
                                      <div className="font-medium truncate pr-5">{workout.type}</div>
                                      <div className="text-xs opacity-75">{workout.duration}min</div>
                                    </div>
                                ))}
                              </>
                          )}
                        </div>
                    ))}
                  </div>

                  {/* Monthly Stats */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div
                        className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-400/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{monthlyWorkouts.length}</div>
                        <div className="text-sm text-gray-300">Total Workouts</div>
                      </div>
                    </div>
                    <div
                        className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-400/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {monthlyWorkouts.filter((w) => w.completed).length}
                        </div>
                        <div className="text-sm text-gray-300">Completed</div>
                      </div>
                    </div>
                    <div
                        className="p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-400/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {monthlyWorkouts.reduce(
                              (total, w) => total + (w.completed ? Number.parseInt(w.duration) || 0 : 0),
                              0,
                          )}
                        </div>
                        <div className="text-sm text-gray-300">Minutes Trained</div>
                      </div>
                    </div>
                    <div
                        className="p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-400/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {monthlyWorkouts.length > 0
                              ? Math.round(
                                  (monthlyWorkouts.filter((w) => w.completed).length / monthlyWorkouts.length) * 100,
                              )
                              : 0}
                          %
                        </div>
                        <div className="text-sm text-gray-300">Completion Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gradient-to-l from-slate-800 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Our Services
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Comprehensive fitness solutions designed to help you reach your goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardHeader>
                  <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
                    <Image
                        src="https://i.imgur.com/GMfVqYs.jpeg"
                        alt="Personal Training Session"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div
                      className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Dumbbell className="h-6 w-6 text-white"/>
                  </div>
                  <CardTitle className="text-white">Personal Training</CardTitle>
                  <CardDescription className="text-gray-300">One-on-one sessions with certified
                    trainers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Customized workout plans
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Nutrition guidance
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Progress tracking
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">From $80/session</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardHeader>
                  <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
                    <Image
                        src="https://i.imgur.com/DwZQSkP.jpeg"
                        alt="Group Fitness Class"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div
                      className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white"/>
                  </div>
                  <CardTitle className="text-white">Group Classes</CardTitle>
                  <CardDescription className="text-gray-300">High-energy group fitness sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      HIIT & Cardio
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Yoga & Pilates
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Strength Training
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">From $25/class</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardHeader>
                  <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=200&width=400&text=Healthy+Meal+Prep+and+Nutrition"
                        alt="Nutrition and Meal Planning"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div
                      className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-white"/>
                  </div>
                  <CardTitle className="text-white">Nutrition Coaching</CardTitle>
                  <CardDescription className="text-gray-300">
                    Professional dietary guidance and meal planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Meal planning
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Supplement advice
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      Body composition analysis
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">From $60/session</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Our Staff Section */}
        <section id="staff" className="py-20 bg-gradient-to-l from-purple-900 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Meet Our Expert Team
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Our certified trainers and fitness experts are here to guide you on your fitness journey.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=150&width=150&text=Sarah+Johnson+Personal+Trainer"
                        alt="Sarah Johnson - Head Trainer"
                        fill
                        className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Sarah Johnson</h3>
                  <p className="text-purple-400 font-semibold mb-2">Head Trainer</p>
                  <p className="text-gray-300 text-sm mb-3">
                    10+ years experience in strength training and nutrition coaching
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Badge className="bg-purple-600/50 text-purple-200">NASM Certified</Badge>
                    <Badge className="bg-pink-600/50 text-pink-200">Nutrition</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=150&width=150&text=Mike+Rodriguez+Fitness+Coach"
                        alt="Mike Rodriguez - Fitness Coach"
                        fill
                        className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Mike Rodriguez</h3>
                  <p className="text-purple-400 font-semibold mb-2">Fitness Coach</p>
                  <p className="text-gray-300 text-sm mb-3">
                    Specializes in HIIT, functional training, and athletic performance
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Badge className="bg-purple-600/50 text-purple-200">ACSM Certified</Badge>
                    <Badge className="bg-pink-600/50 text-pink-200">HIIT</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=150&width=150&text=Emma+Chen+Yoga+Instructor"
                        alt="Emma Chen - Yoga Instructor"
                        fill
                        className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Emma Chen</h3>
                  <p className="text-purple-400 font-semibold mb-2">Yoga Instructor</p>
                  <p className="text-gray-300 text-sm mb-3">
                    Certified in Hatha, Vinyasa, and therapeutic yoga practices
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Badge className="bg-purple-600/50 text-purple-200">RYT-500</Badge>
                    <Badge className="bg-pink-600/50 text-pink-200">Meditation</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                  className="bg-black/20 backdrop-blur-md border-white/10 hover:border-purple-400/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=150&width=150&text=David+Thompson+Sports+Therapist"
                        alt="David Thompson - Sports Therapist"
                        fill
                        className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">David Thompson</h3>
                  <p className="text-purple-400 font-semibold mb-2">Sports Therapist</p>
                  <p className="text-gray-300 text-sm mb-3">
                    Injury prevention, rehabilitation, and sports massage therapy
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Badge className="bg-purple-600/50 text-purple-200">Licensed PT</Badge>
                    <Badge className="bg-pink-600/50 text-pink-200">Rehab</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3">
                Book a Consultation
              </Button>
            </div>
          </div>
        </section>
        {/* Gym Equipment Showcase */}
        <section id="equipment" className="py-20 bg-gradient-to-r from-slate-900 to-purple-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                State-of-the-Art Equipment
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Train with the latest and most advanced fitness equipment in the industry.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative h-64 rounded-lg overflow-hidden group">
                <Image
                    src="https://cdn.mos.cms.futurecdn.net/5QV4TcUWvsfYmm9hAdWXHD.jpg"
                    alt="Cardio Equipment"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">Cardio Zone</h3>
                  <p className="text-gray-300">Treadmills, bikes, ellipticals</p>
                </div>
              </div>

              <div className="relative h-64 rounded-lg overflow-hidden group">
                <Image
                    src="https://powersystems.com/cdn/shop/files/0722_strength_lp_hero_1920x700_v2.jpg?v=1738320606&width=3840"
                    alt="Weight Training"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">Strength Training</h3>
                  <p className="text-gray-300">Free weights & machines</p>
                </div>
              </div>

              <div className="relative h-64 rounded-lg overflow-hidden group">
                <Image
                    src="https://media.istockphoto.com/id/1153467910/photo/disassembled-barbell-medicine-ball-kettlebell-dumbbell-jump-rope-lying-on-floor-in-gym-sports.jpg?s=612x612&w=0&k=20&c=SVGa2NhVYgdF6P7xbejb9BoWJhKYfIclkqoyIoiPOKE="
                    alt="Functional Training"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">Functional Area</h3>
                  <p className="text-gray-300">TRX, kettlebells, battle ropes</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-r from-purple-900 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Get In Touch
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to start your fitness journey? Contact us today for a free consultation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                    <p className="text-gray-300">info@fitzone.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Location</h3>
                    <p className="text-gray-300">
                      123 Fitness Street
                      <br/>
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Send us a message</CardTitle>
                  <CardDescription className="text-gray-300">We'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        First Name
                      </Label>
                      <Input
                          id="firstName"
                          placeholder="John"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">
                        Last Name
                      </Label>
                      <Input
                          id="lastName"
                          placeholder="Doe"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                      Message
                    </Label>
                    <textarea
                        id="message"
                        rows={4}
                        placeholder="Tell us about your fitness goals..."
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Dumbbell className="h-6 w-6 text-purple-400"/>
              <span
                  className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitZone
            </span>
            </div>
            <p className="text-gray-400">
              © 2025 FitZone. All rights reserved. Transform your body, transform your life.
            </p>
          </div>
        </footer>
      </div>
  )
}
