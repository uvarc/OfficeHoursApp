export const endpoint_url = "https://uvarc-unified-service.pods.uvarc.io/uvarc/api/ticket/officehours/create_ticket"

// RC-Staff Info
export const rcStaff = [
    { value: "jus2yw", label: "Ahmad Sheikhzada" },
    { value: "aab5zd", label: "Angela Boakye" },
    { value: "kjl5t", label: "Kathryn Linehan" },
    { value: "gpd6kn", label: "Priyanka Prakash" },
    { value: "teh1m", label: "Ed Hall" },
    { value: "gka6a", label: "Gladys Andino" },
    { value: "jmh5ad", label: "Jackie Huband" },
    { value: "khs3z", label: "Karsten Siller" },
    { value: "kah3f", label: "Katherine Holcomb" },
    { value: "mb5wt", label: "Marcus Bobar" },
    { value: "egg3xa", label: "Paul Orndorff" },
    { value: "rs7wz", label: "Ruoshi Sun" },
    { value: "cmd7ag", label: "Camden Duy" },
    { value: "xve5kj", label: "Hana Parece" },
  ];

// Details Info
const _details = [
    "System: Outage",
    "System: Performance",
    "Access: Allocation/account",
    "Access: VPN",
    "Access: SSH",
    "Access: MobaXterm",
    "Access: FastX",
    "Access: OOD",
    "Access: other",
    "OOD: JupyterLab",
    "OOD: RStudio",
    "OOD: Matlab",
    "OOD: Desktop",
    "OOD: other",
    "File Transfer: Globus",
    "File Transfer: DTN",
    "File Transfer: CLI tools",
    "File Transfer: other",
    "HW: Standard",
    "HW: Parallel",
    "HW: Largemem",
    "HW: GPU",
    "HW: Condo",
    "HW: DB host",
    "HW: other",
    "Language: C/C++",
    "Language: Fortran",
    "Language: Python",
    "Language: R",
    "Language: Matlab",
    "Language: Bash",
    "Language: other",
    "Domain: General HPC/Slurm",
    "Domain: HPC Optimization & Parallelization",
    "Domain: Software Installs/Containers",
    "Domain: Software Development",
    "Domain: Databases",
    "Domain: AI/ML/DL",
    "Domain: Data Science/Data Analytics",
    "Domain: Bioinformatics",
    "Domain: Image Processing",
    "Domain: Computational Chemistry",
    "Domain: Text Analysis",
    "Domain: Physics",
    "Documentation (answer not yet in documentation)",
  ];

// disciplines info
const _disciplines = [
    "Astronomy",
    "Biochemistry",
    "Bioinformatics",
    "Biology",
    "Business",
    "Chemistry",
    "Commerce",
    "Computer Science",
    "Data Science",
    "Economics",
    "Education",
    "Environmental Science",
    "Engineering",
    "Health Sciences",
    "Informatics",
    "Law",
    "Physics",
    "Social Sciences",
    "Other",
  ]

// Meeting Types Info
const _meetingTypes = [
    "Office Hours (walk-in)",
    "Consultation (scheduled)",
    "Outreach Event (scheduled)",
    "Training",
    "Other",
  ]

// Request Types Info
const _requestTypes = [
    "Technical Support Tier 1",
    "Technical Support Tier 2",
    "Consulting Tier 1",
    "Consulting Tier 2",
    "Provisioning/Deprovisioning",
    "Education/Outreach",
  ]
  
// Convert to value, label pairs for easy integration w/ inputs
// These objects are the constants that are exportable
const toOption = (str) => ({ value: str, label: str })

export const detailOptions = [
   ..._details.map(toOption),
  ]

export const disciplineOptions = [
    { value: "", label: "Select Option", disabled: true },
    ..._disciplines.map(toOption),
  ]

export const meetingTypeOptions = [
    ..._meetingTypes.map(toOption),
  ]

export const requestTypeOptions = [
    { value: "", label: "Select Option", disabled: true },
    ..._requestTypes.map(toOption),
  ]