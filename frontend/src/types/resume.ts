export interface ResumeAnalysis {
  skills?: string[];
  projects?: string[];
  experience?: string[];
  education?: string[];
  suggestedRoles?: string[];
  weakAreas?: string[];
}

export interface ResumeUploadResponse {
  success: boolean;
  resumeText?: string;
  analysis?: string;
}
