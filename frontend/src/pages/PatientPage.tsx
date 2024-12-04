import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableCaption,
    TableHeader,
  } from "@/components/ui/table"
  


const PatientPage = () => {
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">Patient Treatments</h1>
    <p className="text-gray-600 mb-6">
      Below is the list of patients and their treatment status.
    </p>

    {/* Table */}
    <div className="overflow-x-auto">
    <Table>
  <TableCaption>A list of patients.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">#</TableHead>
      <TableHead>ID</TableHead>
      <TableHead>Treatment</TableHead>
      <TableHead>Amount Required</TableHead>
      <TableHead>Amount Paid</TableHead>
      <TableHead className="text-right">Donation Accepted</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">1</TableCell>
      <TableCell>001</TableCell>
      <TableCell>Heart Transplant</TableCell>
      <TableCell>100</TableCell>
      <TableCell>25</TableCell>
      <TableCell className="text-right">75</TableCell>
    </TableRow>
  </TableBody>
</Table>

    </div>
  </div>
</div>

  )
}

export default PatientPage