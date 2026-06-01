export type UserRole = "admin" | "regional" | "office" | "zone"

export interface UserProfile {
  name: string
  email: string
  password: string
  role: UserRole
  displayRole: string
  allowedBranches: string[]
  allowedZones: string[]
  regionLabel?: string
}

const branchCodeToName: Record<string, string> = {
  "LMIT-HS-BARI": "HS BARI",
  "LMIT-HS-NAPLES": "HS NAPOLI",
  "LMIT-HS-PALERMO": "HS PALERMO",
  "LMIT-HS-ROME": "HS ROMA",
  "LMIT-HS-MILAN": "HS MILANO",
  "LMIT-HS-BOLOGNA": "HS BOLOGNA",
  "LMIT-HS-PADOVA": "HS PADOVA",
  "LMIT-HS-TORINO": "HS TORINO",
}

const allBranches = Object.values(branchCodeToName)

export const users: UserProfile[] = [
  {
    name: "DILAN FERNANDO",
    email: "dilan.fernando@universalservice.it",
    password: "3510016000",
    role: "admin",
    displayRole: "Hotspot Manager Admin",
    allowedBranches: allBranches,
    allowedZones: [],
  },
  {
    name: "Niyamathan Sivapatham",
    email: "sivapatham.n@universalservice.it",
    password: "3510104080",
    role: "regional",
    displayRole: "Regional Manager Admin",
    allowedBranches: ["HS BARI", "HS NAPOLI", "HS PALERMO", "HS ROMA"],
    allowedZones: [],
    regionLabel: "South",
  },
  {
    name: "Alfred Sahaya Renaulton",
    email: "alfred.renaulton@universalservice.it",
    password: "3510020199",
    role: "regional",
    displayRole: "Regional Manager Admin",
    allowedBranches: ["HS BOLOGNA", "HS MILANO", "HS PADOVA", "HS TORINO"],
    allowedZones: [],
    regionLabel: "North",
  },
  {
    name: "Stelwin Kachappilly",
    email: "stelwin.kachappilly@universalservice.it",
    password: "3510023408",
    role: "office",
    displayRole: "Bari Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-BARI"]],
    allowedZones: [],
  },
  {
    name: "Thineshkumar Chanthirakanthan",
    email: "thineshkumar.c@universalservice.it",
    password: "3511191777",
    role: "office",
    displayRole: "Napoli Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-NAPLES"]],
    allowedZones: [],
  },
  {
    name: "Alfred Remil",
    email: "remilton.alfred@universalservice.it",
    password: "3512211691",
    role: "office",
    displayRole: "Palermo Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-PALERMO"]],
    allowedZones: [],
  },
  {
    name: "Faizal Nishan Ali",
    email: "faizal.ali@universalservice.it",
    password: "3510146741",
    role: "office",
    displayRole: "Rome Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-ROME"]],
    allowedZones: [],
  },
  {
    name: "Dimuthu Fernando",
    email: "dimuthu.fernando@universalservice.it",
    password: "3511735310",
    role: "office",
    displayRole: "Milan Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-MILAN"]],
    allowedZones: [],
  },
  {
    name: "Thushara Darshana Fernando Widanelage",
    email: "thushara.darshana@universalservice.it",
    password: "3510022000",
    role: "office",
    displayRole: "Bologna Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-BOLOGNA"]],
    allowedZones: [],
  },
  {
    name: "Pratheep Kumaaar",
    email: "pratheep.kumaar@universalservice.it",
    password: "3510511500",
    role: "office",
    displayRole: "Padova Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-PADOVA"]],
    allowedZones: [],
  },
  {
    name: "Santosh Chandrabalan",
    email: "santosh.chandrabalan@universalservice.it",
    password: "3508048862",
    role: "office",
    displayRole: "Torino Office Manager Admin",
    allowedBranches: [branchCodeToName["LMIT-HS-TORINO"]],
    allowedZones: [],
  },
  {
    name: "JESUTHASAN LINDON FRANCESCO",
    email: "lindon.francesco@universalservice.it",
    password: "3512359754",
    role: "zone",
    displayRole: "Zone Manager - Bari",
    allowedBranches: ["HS BARI"],
    allowedZones: ["HS BARI ZONE 1"],
  },
  {
    name: "HASHMI AHMAD",
    email: "ahmad.hashmi@universalservice.it",
    password: "3512343479",
    role: "zone",
    displayRole: "Zone Manager - Bari",
    allowedBranches: ["HS BARI"],
    allowedZones: ["HS BARI ZONE 2"],
  },
  {
    name: "SUTHARSAN SURENDRAN",
    email: "Sutharsan.Surendran@universalservice.it",
    password: "3511439222",
    role: "zone",
    displayRole: "Zone Manager - Bari",
    allowedBranches: ["HS BARI"],
    allowedZones: ["HS BARI ZONE 3"],
  },
  {
    name: "VITHUNRAAJ JEGANATHAN",
    email: "vithunraaj.jeganathan@universalservice.it",
    password: "3510045100",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 1"],
  },
  {
    name: "ROY SOORIYAKUMAR NILANTHAN",
    email: "roy.nilanthan@universalservice.it",
    password: "3509028271",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 2"],
  },
  {
    name: "THUSHSHANTH RAJESWARAN",
    email: "Thushshanth.R@universalservice.it",
    password: "3511686611",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 3"],
  },
  {
    name: "ANTONIO PIPOLO",
    email: "antonio.pipolo@universalservice.it",
    password: "3510342193",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 4"],
  },
  {
    name: "SALSANO ANTONIO",
    email: "salsano.antonio@universalservice.it",
    password: "3511559444",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 5"],
  },
  {
    name: "ATPUTHARAJAH DISHANTHAN",
    email: "atputharajah.d@universalservice.it",
    password: "3533464289",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 6"],
  },
  {
    name: "CAMBREA DAVID",
    email: "david.cambrea@universalservice.it",
    password: "3512942749",
    role: "zone",
    displayRole: "Zone Manager - Napoli",
    allowedBranches: ["HS NAPOLI"],
    allowedZones: ["HS NAPOLI ZONE 7"],
  },
  {
    name: "RUGGERO TUMAMAO",
    email: "tumamao.ruggero@universalservice.it",
    password: "3510146678",
    role: "zone",
    displayRole: "Zone Manager - Palermo",
    allowedBranches: ["HS PALERMO"],
    allowedZones: ["HS PALERMO ZONE 1"],
  },
  {
    name: "JIBO ABDALLAH DAUDA",
    email: "jibo.dauda@universalservice.it",
    password: "3511430011",
    role: "zone",
    displayRole: "Zone Manager - Palermo",
    allowedBranches: ["HS PALERMO"],
    allowedZones: ["HS PALERMO ZONE 2"],
  },
  {
    name: "SHAMIKA SAMARASINHA",
    email: "shamika.samarasinha@universalservice.it",
    password: "3508273883",
    role: "zone",
    displayRole: "Zone Manager - Palermo",
    allowedBranches: ["HS PALERMO"],
    allowedZones: ["HS PALERMO ZONE 3"],
  },
  {
    name: "MD SABBIR ALAM",
    email: "alam.sabbir@universalservice.it",
    password: "3509868856",
    role: "zone",
    displayRole: "Zone Manager - Rome",
    allowedBranches: ["HS ROMA"],
    allowedZones: ["HS ROMA ZONE 1"],
  },
  {
    name: "PUTHUVA POULOSE SEBY",
    email: "puthuva.seby@universalservice.it",
    password: "3510892772",
    role: "zone",
    displayRole: "Zone Manager - Rome",
    allowedBranches: ["HS ROMA"],
    allowedZones: ["HS ROMA ZONE 2"],
  },
  {
    name: "MOLLA ANAMULHAQUE",
    email: "molla.anamulhaque@universalservice.it",
    password: "3512180576",
    role: "zone",
    displayRole: "Zone Manager - Rome",
    allowedBranches: ["HS ROMA"],
    allowedZones: ["HS ROMA ZONE 3"],
  },
  {
    name: "MOHAMMED MOINUL HASAN",
    email: "moinul.hassan@universalservice.it",
    password: "3508551119",
    role: "zone",
    displayRole: "Zone Manager - Rome",
    allowedBranches: ["HS ROMA"],
    allowedZones: ["HS ROMA ZONE 4"],
  },
  {
    name: "ISURU RAMANAYAKA",
    email: "Isuru.Ramanayaka@universalservice.it",
    password: "3508545550",
    role: "zone",
    displayRole: "Zone Manager - Rome",
    allowedBranches: ["HS ROMA"],
    allowedZones: ["HS ROMA ZONE 5"],
  },
  {
    name: "NAZRUL ISLAM WASEEM",
    email: "nazrul.waseem@universalservice.it",
    password: "3511701170",
    role: "zone",
    displayRole: "Zone Manager - Milan",
    allowedBranches: ["HS MILANO"],
    allowedZones: ["HS MILANO ZONE 1"],
  },
  {
    name: "ALAM FAHIM",
    email: "alam.fahim@universalservice.it",
    password: "3511002589",
    role: "zone",
    displayRole: "Zone Manager - Milan",
    allowedBranches: ["HS MILANO"],
    allowedZones: ["HS MILANO ZONE 2"],
  },
  {
    name: "FAROOQ UMAR",
    email: "farooq.umar@universalservice.it",
    password: "3511254113",
    role: "zone",
    displayRole: "Zone Manager - Milan",
    allowedBranches: ["HS MILANO"],
    allowedZones: ["HS MILANO ZONE 3"],
  },
  {
    name: "KARIM FAHAD",
    email: "farhad.karim@Universalservice.It",
    password: "3508625761",
    role: "zone",
    displayRole: "Zone Manager - Milan",
    allowedBranches: ["HS MILANO"],
    allowedZones: ["HS MILANO ZONE 4"],
  },
  {
    name: "KAMAL HOSSAIN",
    email: "Kamal.Hossain@universalservice.it",
    password: "3512980321",
    role: "zone",
    displayRole: "Zone Manager - Bologna",
    allowedBranches: ["HS BOLOGNA"],
    allowedZones: ["HS BOLOGNA ZONE 1"],
  },
  {
    name: "DHANI MEHEDI",
    email: "mehedi.dhani@universalservice.it",
    password: "3508665870",
    role: "zone",
    displayRole: "Zone Manager - Bologna",
    allowedBranches: ["HS BOLOGNA"],
    allowedZones: ["HS BOLOGNA ZONE 2"],
  },
  {
    name: "ALI SHAFQAT",
    email: "shafqat.ali@universalservice.it",
    password: "3508354510",
    role: "zone",
    displayRole: "Zone Manager - Bologna",
    allowedBranches: ["HS BOLOGNA"],
    allowedZones: ["HS BOLOGNA ZONE 3"],
  },
  {
    name: "ZARYAB AHMED",
    email: "zaryab.ahmed@universalservice.it",
    password: "3508545372",
    role: "zone",
    displayRole: "Zone Manager - Padova",
    allowedBranches: ["HS PADOVA"],
    allowedZones: ["HS PADOVA ZONE 1"],
  },
  {
    name: "MUZZAFAR SIKANDAR",
    email: "Muzzafar.Sikandar@Universalservice.it",
    password: "3511001183",
    role: "zone",
    displayRole: "Zone Manager - Padova",
    allowedBranches: ["HS PADOVA"],
    allowedZones: ["HS PADOVA ZONE 2"],
  },
  {
    name: "MILKI MD MASUD ALAM",
    email: "milki.masud@universalservice.it",
    password: "3511550034",
    role: "zone",
    displayRole: "Zone Manager - Torino",
    allowedBranches: ["HS TORINO"],
    allowedZones: ["HS TORINOO ZONE 1"],
  },
  {
    name: "GUEYE KHADIM",
    email: "gueye.khadim@universalservice.it",
    password: "3508951923",
    role: "zone",
    displayRole: "Zone Manager - Torino",
    allowedBranches: ["HS TORINO"],
    allowedZones: ["HS TORINOO ZONE 2"],
  },
  {
    name: "HOSSAIN MD SIFAT",
    email: "hossain.Sifat@universalservice.it",
    password: "3510783922",
    role: "zone",
    displayRole: "Zone Manager - Torino",
    allowedBranches: ["HS TORINO"],
    allowedZones: ["HS TORINOO ZONE 3"],
  },
]

const STORAGE_KEY = "sim-collection-user"

export function authenticate(email: string, password: string): UserProfile | null {
  return users.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password.trim(),
  ) ?? null
}

export function storeUser(user: UserProfile) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}
