export interface StudentDetails {
  name: string;
  idNumber: string;
  email: string;
  address: string;
  dateOfBirth: string;
  course: string;

  batch: string;
  section: string;
  contactNo: string;
  guardianName: string;
  guardianContact: string;
  photoUrl: string;
  isPresent?: boolean;
  isLate?: boolean;
}
