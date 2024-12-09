import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, DollarSign, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "http://127.0.0.1:8000";

const CareAIDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [newDonation, setNewDonation] = useState({
    patientId: "",
    amount: "",
  });
  const [patients, setPatients] = useState([]);

  const handleAddDonation = () => {
    if (newDonation.patientId && newDonation.amount) {
      setDonations([
        ...donations,
        {
          id: donations.length + 1,
          patientId: newDonation.patientId,
          amount: parseFloat(newDonation.amount),
        },
      ]);
      // Reset form
      setNewDonation({ patientId: "", amount: "" });
    }
  };

  const fetchPatientsData = async () => {
    const response = await axios.get(`${API_BASE_URL}/patients`);
    return response.data;
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPatientsData();
      setPatients(data);
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Main Content */}
      <div
        className={`flex-1 p-8 ${
          isDrawerOpen ? "ml-0" : "ml-0"
        } overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <h1>
          Donate Your Amount! Our AI System will take care of your donation and
          give to the m
        </h1>
        {/* Mobile/Collapsed Drawer Toggle */}
        {!isDrawerOpen && (
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 w-8 h-8 text-2xl"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="w-full " />
          </Button>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Patients Table */}
          <Card className="col-span-2 bg-slate-100">
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
                  {patients?.map((patient) => (
                    <TableRow className="text-md" key={patient.id}>
                      <TableCell>{patient?.id}</TableCell>
                      <TableCell>{patient?.disease}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            patient.severityScore > 7
                              ? "destructive"
                              : patient.severityScore > 4
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {patient.severityScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            patient.priorityScore > 7
                              ? "destructive"
                              : patient.priorityScore > 4
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {patient.priorityScore}
                        </Badge>
                      </TableCell>
                      <TableCell>${patient?.amount_required}</TableCell>
                      <TableCell>${patient?.amount_paid}</TableCell>
                      <TableCell className="">
                        ${patient?.donation_allotted}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Donations Section */}
          <Card className="col-span-1 bg-slate-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Donations</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Donation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Donation</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="patientId" className="text-right">
                          Patient ID
                        </Label>
                        <Input
                          id="patientId"
                          value={newDonation.patientId}
                          onChange={(e) =>
                            setNewDonation({
                              ...newDonation,
                              patientId: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newDonation.amount}
                          onChange={(e) =>
                            setNewDonation({
                              ...newDonation,
                              amount: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddDonation}>Add Donation</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-muted-foreground">No donations yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.patientId}</TableCell>
                        <TableCell>${donation.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareAIDashboard;
