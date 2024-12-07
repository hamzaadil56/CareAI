import React, { useState } from "react";
import { LayoutDashboard, Users, DollarSign, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

// Sample patient data (replace with actual data source)
const samplePatients = [
  {
    id: 1,
    name: "123-xyze4",
    disease: "Cancer",
    severityScore: 8,
    priorityScore: 9,
    amountRequired: 5000,
    amountPaid: 2000,
    donationAllotted: 1000,
  },
  {
    id: 2,
    name: "123-xyzt",
    disease: "Heart Condition",
    severityScore: 7,
    priorityScore: 7,
    amountRequired: 3500,
    amountPaid: 1500,
    donationAllotted: 1000,
  },
  {
    id: 3,
    name: "123-xyzads",
    disease: "Diabetes",
    severityScore: 5,
    priorityScore: 6,
    amountRequired: 2000,
    amountPaid: 800,
    donationAllotted: 1000,
  },
];

const CareAIDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [newDonation, setNewDonation] = useState({
    patientId: "",
    amount: "",
  });

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

  return (
    <div className="flex h-screen text-2xl">
      {/* Side Drawer - Now with default open state */}
      <div
        className={`${
          isDrawerOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out`}
      >
        <div
          className={`${
            isDrawerOpen ? "block bg-slate-100" : "hidden"
          } h-full bg-gray-300 border-r`}
        >
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center px-3 mb-4">
              <h2 className="text-3xl px-3 font-semibold tracking-tight">
                Care AI
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-1 px-3">
              <Button variant="ghost" className="w-full justify-start text-lg">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg">
                <Users className="mr-2 h-4 w-4" />
                Patients
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg">
                <DollarSign className="mr-2 h-4 w-4" />
                Donations
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 ${
          isDrawerOpen ? "ml-0" : "ml-0"
        } overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <h1>Donate Your Amount! Our AI System will take care of your donation and give to the m</h1>
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
                  {samplePatients.map((patient) => (
                    <TableRow className="text-md" key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.disease}</TableCell>
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
                      <TableCell>${patient.amountRequired}</TableCell>
                      <TableCell>${patient.amountPaid}</TableCell>
                      <TableCell className="">
                        ${patient.donationAllotted}
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
