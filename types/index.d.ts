/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
   params: { [key: string]: string };
   searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = 'Male' | 'Female' | 'Other';
declare type Status = 'pending' | 'scheduled' | 'cancelled';

declare interface CreateUserParams {
   name: string;
   email: string;
   phone: string;
}
declare interface User extends CreateUserParams {
   $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
   userId: string;
   birthDate: Date;
   gender: Gender;
   address: string;
   occupation: string;
   emergencyContactName: string;
   emergencyContactNumber: string;
   primaryPhysician: string;
   insuranceProvider: string;
   insurancePolicyNumber: string;
   allergies?: string;
   currentMedication?: string;
   familyMedicalHistory?: string;
   pastMedicalHistory?: string;
   identificationType?: string;
   identificationNumber?: string;
   identificationDocument?: FormData;
   privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
   userId: string;
   patient: string;
   primaryPhysician: string;
   reason: string;
   schedule: Date;
   status: Status;
   note?: string;
};

declare interface Appointment {
   appointmentId: string;
   userId: string;
   patient: string;
   primaryPhysician: string;
   reason: string;
   schedule: Date;
   status: Status;
   note?: string;
}

declare type UpdateAppointmentParams = {
   appointmentId: string;
   userId: string;
   appointment: Appointment;
   type: string;
};
