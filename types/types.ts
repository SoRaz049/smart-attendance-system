export interface StudentDetails {
  name: string;
  idNumber: string;
  email: string;
  address: string;
  dateOfBirth: string;
  courseRef: {
    name: string;
    courseCode: string;
  };
  batch: string;
  section: string;
  contactNo: string;
  guardianName: string;
  guardianContact: string;
  photoUrl: string;
}
