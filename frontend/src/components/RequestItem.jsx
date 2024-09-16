import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf'; 
import './RequestItem.css';
import { fetchMaterialsByMaterialDescription, fetchUserById, fetchIssuer } from '../api'; // Import the API functions

function RequestItem({ request }) {
  const [material, setMaterial] = useState(null);
  const [requesterName, setRequesterName] = useState(''); // State to hold requester name
  const [issuerName, setIssuerName] = useState(''); // State to hold the name of the person who issued the request
  const [approver, setApprover] = useState('');

  // Fetch material data
  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const response = await fetchMaterialsByMaterialDescription(request.description);
        setMaterial(response.data[0]); 
      } catch (error) {
        console.error('Error fetching material data', error);
      }
    };
    fetchMaterialData();
  }, [request.description]);

  // Fetch requester name
  useEffect(() => {
    const fetchRequesterName = async () => {
      try {
        const response = await fetchUserById(request.requester); // Use the requester ID to fetch user details
        setRequesterName(response.data.username); 
      } catch (error) {
        console.error('Error fetching requester name', error);
      }
    };
    if (request.requester) {
      fetchRequesterName(); // Fetch the name only if requester ID is available
    }
  }, [request.requester]);

  // Fetch issuer name if request is issued
  useEffect(() => {
    const fetchIssuerName = async () => {
      try {
        const response = await fetchIssuer(request.issuedBy); // Use the issuedBy ID to fetch user details
        setIssuerName(response.data.username); 
      } catch (error) {
        console.error('Error fetching issuer name', error);
      }
    };
    if (request.status === 'Issued' && request.issuedBy) {
      fetchIssuerName();
    }
  }, [request.status, request.issuedBy]);

  // Fetch approver name if request is approved
  useEffect(() => {
    const fetchApproverName = async () => {
      try {
        const response = await fetchIssuer(request.approvedBy); // Use the approvedBy ID to fetch user details
        setApprover(response.data.username);
      } catch (error) {
        console.error('Error fetching approver name', error);
      }
    };
    if (request.status === 'Approved' && request.approvedBy) {
      fetchApproverName();
    }
  }, [request.status, request.approvedBy]);

  // Function to generate PDF of issuance slip
const downloadPDF = () => {
  const pdf = new jsPDF();
  const lineSpacing = 10;
  let yPosition = 20;

  // Header section for the Issuance Slip
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold'); // Bold font for the title
  pdf.text('Issuance Slip', 105, yPosition, null, null, 'center'); // Title in the center
  yPosition += lineSpacing;

  // Underline the Issuance Slip title
  pdf.setDrawColor(0, 0, 0); // Set color for underline
  yPosition += lineSpacing;
  pdf.line(60, yPosition - 5, 150, yPosition - 5); // Draw line (underline)
  // Centralized Request Details Section
  pdf.setFontSize(14);
  pdf.text('Request Details', 105, yPosition, null, null, 'center'); // Centralized heading
  yPosition += lineSpacing;

  // Underline the Request Details heading
  pdf.line(60, yPosition - 5, 150, yPosition - 5); // Draw line (underline)
  yPosition += lineSpacing;

  // Request Details Table
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Request Number:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Bold for label
  pdf.text(String(request._id || 'N/A'), 80, yPosition);
  yPosition += lineSpacing;



  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Description:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(request.description || 'N/A'), 80, yPosition);
  yPosition += lineSpacing;

  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Requested By:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(requesterName || 'Unknown'), 80, yPosition);
  yPosition += lineSpacing;

  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Quantity Requested:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(request.quantityRequested || 'N/A'), 80, yPosition);
  yPosition += lineSpacing;

  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Status:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(request.status || 'N/A'), 80, yPosition);
  yPosition += lineSpacing;

  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Relevant Manager:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(request.requestedManager || 'N/A'), 80, yPosition);
  yPosition += lineSpacing;

  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Request Made On:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(new Date(request.createdAt).toLocaleString()), 80, yPosition);
  yPosition += lineSpacing;

  if (request.status === 'Approved' && approver) {
    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('Approved By:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(approver || 'Unknown'), 80, yPosition);
    yPosition += lineSpacing;
  }

  if (request.status === 'Issued' && issuerName) {
    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('Issued By:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(issuerName || 'Unknown'), 80, yPosition);
    yPosition += lineSpacing;
  }

  yPosition += lineSpacing;

  // Centralized Material Data Heading
  pdf.line(60, yPosition - 5, 150, yPosition - 5); // Draw line (underline)
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold'); // Bold for heading
  pdf.text('Material Data', 105, yPosition, null, null, 'center'); // Centralized heading
  yPosition += lineSpacing;

  // Underline the Material Data heading
  pdf.line(60, yPosition - 5, 150, yPosition - 5); // Draw line (underline)
  yPosition += lineSpacing;

  // Material Data Table
  if (material) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('Material:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(material.material || 'N/A'), 80, yPosition);
    yPosition += lineSpacing;

    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('Part No:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(material.part_no_store_code || 'N/A'), 80, yPosition);
    yPosition += lineSpacing;

    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('Available Quantity:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(material.quantity || 'N/A'), 80, yPosition);
    yPosition += lineSpacing;

    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('Machine:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(material.machine || 'N/A'), 80, yPosition);
    yPosition += lineSpacing;

    pdf.setFont('helvetica', 'bold'); // Bold for label
    pdf.text('UOM:', 20, yPosition);
    pdf.setFont('helvetica', 'normal'); // Normal for value
    pdf.text(String(material.uom || 'N/A'), 80, yPosition);
    yPosition += lineSpacing;
  }

  // Footer section for Print Date/Time and Signature
  yPosition += lineSpacing * 2;
  pdf.setFont('helvetica', 'bold'); // Bold for label
  pdf.text('Printed On:', 20, yPosition);
  pdf.setFont('helvetica', 'normal'); // Normal for value
  pdf.text(String(new Date().toLocaleString()), 80, yPosition);
  yPosition += lineSpacing * 2;

  pdf.setFont('helvetica', 'bold'); // Bold for signature
  pdf.text('Signature:', 20, yPosition);
  pdf.text('________________________', 20, yPosition + lineSpacing);

  // Save the PDF with a dynamic name
  pdf.save(`issuance_slip_${String(request._id)}.pdf`); // Ensure the _id is a string
};




  return (
    <li className="request-item">
      <h4>{request.description}</h4>
      <p>Requested By: {requesterName || 'Unknown'}</p>
      {request.status === 'Approved' && request.approvedBy && (
        <p>Approved By: {approver || 'Unknown'}</p>
      )}
      {request.status === 'Issued' && request.issuedBy && (
        <p>Issued By: {issuerName || 'Unknown'}</p>
      )}
      <p>Shift: {request.shift}</p>
      <p>Quantity Requested: {request.quantityRequested}</p>
      <p>Status: {request.status}</p>
      <p>Relevant Manager: {request.requestedManager}</p>
      <p>Request Made On: {new Date(request.createdAt).toLocaleString()}</p>

      <p>Material Data:</p>
      {material && (
        <ul>
          <li>Material: {material.material}</li>
          <li>Part No: {material.part_no_store_code}</li>
          <li>Available Quantity: {material.quantity}</li>
          <li>Machine: {material.machine}</li>
          <li>UOM: {material.uom}</li>
        </ul>
      )}

      {/* Button to download the request content as a PDF */}
      <button onClick={downloadPDF}>Download as PDF</button>
    </li>
  );
}

export default RequestItem;
