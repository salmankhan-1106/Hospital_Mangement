import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, Calendar, User, Phone, Clipboard, Activity } from 'lucide-react';
import './MedicalReport.css';

const MedicalReport = ({ appointment, patient, doctor }) => {
  const reportRef = useRef();

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: `Medical_Report_${appointment.appointment_code}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Parse result data (assuming it's stored as JSON string)
  let reportData;
  try {
    reportData = typeof appointment.result === 'string' 
      ? JSON.parse(appointment.result) 
      : appointment.result;
  } catch {
    reportData = { diagnosis: appointment.result || 'N/A' };
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="medical-report-container">
      <div className="report-actions">
        <button className="btn-download" onClick={handleDownloadPDF}>
          <Download size={18} />
          Download PDF
        </button>
      </div>

      <div className="medical-report" ref={reportRef}>
        {/* Header */}
        <div className="report-header">
          <div className="hospital-logo">
            <Activity size={48} />
          </div>
          <div className="hospital-info">
            <h1>HealthCare Plus</h1>
            <p>123 Medical Center Drive, City, State 12345</p>
            <p>Phone: (555) 123-4567 | Email: info@healthcareplus.com</p>
          </div>
        </div>

        <div className="report-divider"></div>

        {/* Report Title */}
        <div className="report-title">
          <h2>MEDICAL CONSULTATION REPORT</h2>
          <p className="report-code">Report No: {appointment.appointment_code}</p>
        </div>

        {/* Patient Information */}
        <div className="report-section">
          <div className="section-header">
            <User size={20} />
            <h3>Patient Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Patient Name:</span>
              <span className="info-value">{patient.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact:</span>
              <span className="info-value">{patient.contact}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Report Date:</span>
              <span className="info-value">{formatDate(appointment.created_at)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge status-${appointment.status}`}>
                {appointment.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="report-section">
          <div className="section-header">
            <Clipboard size={20} />
            <h3>Attending Physician</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Doctor Name:</span>
              <span className="info-value">{doctor.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Qualification:</span>
              <span className="info-value">{doctor.qualification || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{doctor.email}</span>
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="report-section">
          <div className="section-header">
            <Activity size={20} />
            <h3>Chief Complaint</h3>
          </div>
          <div className="report-content">
            <p>{appointment.problem}</p>
          </div>
        </div>

        {/* Diagnosis & Treatment */}
        <div className="report-section">
          <div className="section-header">
            <Clipboard size={20} />
            <h3>Diagnosis & Treatment Plan</h3>
          </div>
          <div className="report-content">
            {reportData.diagnosis && (
              <div className="report-subsection">
                <h4>Diagnosis:</h4>
                <p>{reportData.diagnosis}</p>
              </div>
            )}
            {reportData.prescription && (
              <div className="report-subsection">
                <h4>Prescription:</h4>
                <p>{reportData.prescription}</p>
              </div>
            )}
            {reportData.advice && (
              <div className="report-subsection">
                <h4>Medical Advice:</h4>
                <p>{reportData.advice}</p>
              </div>
            )}
            {reportData.followUp && (
              <div className="report-subsection">
                <h4>Follow-up:</h4>
                <p>{reportData.followUp}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <div className="signature-section">
            <div className="signature-line"></div>
            <p className="signature-label">Doctor's Signature</p>
            <p className="doctor-name">{doctor.name}</p>
            <p className="doctor-qualification">{doctor.qualification || ''}</p>
          </div>
          <div className="report-footer-note">
            <p>This is a computer-generated report. For any queries, please contact the hospital.</p>
            <p className="report-date">Generated on: {formatDate(new Date())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReport;
