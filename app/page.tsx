"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function VisitorLogin() {
  const [step, setStep] = useState<"mobile" | "otp" | "form" | "done">("mobile")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [branchId, setBranchId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Visitor form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [meetPerson, setMeetPerson] = useState("")
  const [purpose, setPurpose] = useState("")
  const [idProof, setIdProof] = useState("")

  const baseUrl = "http://localhost:8080" // 🔧 Update for prod

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const branchIdParam = urlParams.get("branch_id")
    if (branchIdParam) setBranchId(branchIdParam)
  }, [])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobile.trim()) {
      setError("Please enter your mobile number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${baseUrl}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          branch_id: branchId,
        }),
      })

      if (response.ok) {
        setStep("otp")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to send OTP")
      }
    } catch (err) {
      console.error("Send OTP error:", err)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${baseUrl}/api/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          otp: otp.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.text()
        localStorage.setItem("vms_jwt", data)
        setStep("form")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Invalid OTP")
      }
    } catch (err) {
      console.error("Verify OTP error:", err)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !meetPerson || !purpose) {
      setError("All fields except ID proof are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const jwt = localStorage.getItem("vms_jwt")

      const response = await fetch(`${baseUrl}/api/visitor/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          whomToMeet: meetPerson,
          purpose,
          idProof,
          branchId,
        }),
      })

      if (response.ok) {
        setStep("done")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Submission failed")
      }
    } catch (err) {
      console.error("Form submit error:", err)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Visitor Verification</h1>
            <p className="text-gray-600 text-sm">
              {step === "mobile" && "Enter your mobile number to get started"}
              {step === "otp" && "Enter the OTP sent to your number"}
              {step === "form" && "Fill your visit details below"}
              {step === "done" && "Thank you! You’ve been checked in"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Mobile */}
          {step === "mobile" && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-md"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-center"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-md"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* Step 3: Visitor Form */}
          {step === "form" && (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Whom to Meet"
                value={meetPerson}
                onChange={(e) => setMeetPerson(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Purpose of Visit"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="ID Proof (optional)"
                value={idProof}
                onChange={(e) => setIdProof(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-md"
              >
                {loading ? "Submitting..." : "Submit & Check-In"}
              </button>
            </form>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Check-in successful</h2>
              <p className="text-gray-600 text-sm">You may now wait for your meeting.</p>
            </div>
          )}

          {branchId && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              Branch ID: <span className="font-mono">{branchId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
