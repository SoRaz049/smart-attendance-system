export type Student = {
  _id?: string;
  name: string;
  idNumber: string;
  email: string;
  phone?: string;
  section: string;
  courseRef: string;
  batch: number;
  dateOfBirth: Date;
  contactNo: string;
  photoUrl: string;
  guardianName: string;
  guardianContact: string;
  isPresent?: boolean;
  createdAt: Date;
  updatedAt: Date;
};
