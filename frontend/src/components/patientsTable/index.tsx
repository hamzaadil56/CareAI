import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const PatientsTable = ({ changed }: { changed: boolean }) => {
  const [patients, setPatients] = useState<any>([]);
  const fetchPatientsData = async () => {
    const response = await axios.get(`${API_BASE_URL}/patients`);
    return response.data;
  };
  // Helper function to determine badge variant based on score
  const getBadgeVariant = (score) => {
    if (score > 7) return "destructive";
    if (score > 4) return "warning";
    return "secondary";
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPatientsData();
      setPatients(data);
    };
    loadData();
  }, [changed]);
  return (
    <Card className="flex-1 bg-slate-100">
      <CardHeader>
        <CardTitle>Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="text-xl">
              <TableHead>ID</TableHead>
              <TableHead>Disease</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Donation Allotted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients?.map((patient: any) => (
              <TableRow className="text-md" key={patient.id}>
                <TableCell>{patient?.id}</TableCell>
                <TableCell>{patient?.disease}</TableCell>
                <TableCell>
                  <Badge variant={"default"}>{patient.severity_score}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"default"}>{patient.priority_score}</Badge>
                </TableCell>
                <TableCell>
                  ${patient?.amount_required?.toFixed(2) || 0}
                </TableCell>
                <TableCell>${patient?.amount_paid?.toFixed(2) || 0}</TableCell>
                <TableCell>
                  ${patient?.donation_allotted?.toFixed(2) || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientsTable;
