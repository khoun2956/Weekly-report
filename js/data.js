const DEFAULT_DATA = {
  "in": [
    {
      "ticket": "LAOI061126024",
      "date": "2026-11-06T00:00:00",
      "from": "Phanoudeth Phengthalangsy",
      "code": "01022",
      "name": "PC POWER",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "LAO-VIET BANK - Vientiane Capital Branch - LAO-VIET BANK",
      "bank": "LAO-VIET BANK"
    },
    {
      "ticket": "LAOI061126023",
      "date": "2026-11-06T00:00:00",
      "from": "Khountheung Dara",
      "code": "08011",
      "name": "BELT VERTICAL TRANSPORT (#31)",
      "store": "Lao-Rework",
      "qty": 3,
      "purpose": "New Order",
      "remark": "LAO-VIET BANK - Pakse Branch - 49010823 - Km7",
      "bank": "LAO-VIET BANK"
    },
    {
      "ticket": "LAOI061126022",
      "date": "2026-11-06T00:00:00",
      "from": "Khamla Chanthavone",
      "code": "02049",
      "name": "PRESENTER S1 F/A (For SS22)",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "SACOMBANK - Vietiane - 44571036 - 2501 - 044",
      "bank": "SACOMBANK"
    },
    {
      "ticket": "LAOI061126022",
      "date": "2026-11-06T00:00:00",
      "from": "Khamla Chanthavone",
      "code": "02028",
      "name": "DOUBLE PICK AREA FA",
      "store": "Lao-Rework",
      "qty": 2,
      "purpose": "New Order",
      "remark": "SACOMBANK - Vietiane - 44571036 - 2501 - 044",
      "bank": "SACOMBANK"
    },
    {
      "ticket": "LAOI061126022",
      "date": "2026-11-06T00:00:00",
      "from": "Khamla Chanthavone",
      "code": "02030",
      "name": "PCB-PICK I/F DOUBLE",
      "store": "Lao-Rework",
      "qty": 2,
      "purpose": "New Order",
      "remark": "SACOMBANK - Vietiane - 44571036 - 2501 - 044",
      "bank": "SACOMBANK"
    },
    {
      "ticket": "LAOI061126022",
      "date": "2026-11-06T00:00:00",
      "from": "Khamla Chanthavone",
      "code": "02029",
      "name": "T CONNECTOR",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "SACOMBANK - Vietiane - 44571036 - 2501 - 044",
      "bank": "SACOMBANK"
    },
    {
      "ticket": "LAOI061126021",
      "date": "2026-11-06T00:00:00",
      "from": "Khountheung Dara",
      "code": "08005",
      "name": "CUP-VACUUM 1=1",
      "store": "Lao-Rework",
      "qty": 4,
      "purpose": "New Order",
      "remark": "LAO PUBLIC BANK - Champasak Branch -",
      "bank": "LAO PUBLIC BANK"
    },
    {
      "ticket": "LAOI061126020",
      "date": "2026-11-06T00:00:00",
      "from": "Khountheung Dara",
      "code": "02049",
      "name": "PRESENTER S1 F/A (For SS22)",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "LAO-VIET BANK - Pakse Branch - 49010823 - Km7",
      "bank": "LAO-VIET BANK"
    },
    {
      "ticket": "LAOI061126020",
      "date": "2026-11-06T00:00:00",
      "from": "Khountheung Dara",
      "code": "08011",
      "name": "BELT VERTICAL TRANSPORT (#31)",
      "store": "Lao-Rework",
      "qty": 3,
      "purpose": "New Order",
      "remark": "LAO-VIET BANK - Pakse Branch - 49010823 - Km7",
      "bank": "LAO-VIET BANK"
    },
    {
      "ticket": "LAOI061126019",
      "date": "2026-11-06T00:00:00",
      "from": "Khamla/Tia fix part in the RW",
      "code": "04011",
      "name": "ROLLER - CARD READER",
      "store": "Lao-Rework",
      "qty": 6,
      "purpose": "New Order",
      "remark": "Tia fix parts in the RW",
      "bank": "RW Fix"
    },
    {
      "ticket": "LAOI061126019",
      "date": "2026-11-06T00:00:00",
      "from": "Khamla/Tia fix part in the RW",
      "code": "04011",
      "name": "ROLLER - CARD READER",
      "store": "Lao-Rework",
      "qty": 6,
      "purpose": "New Order",
      "remark": "Khamla fix parts in the RW",
      "bank": "RW Fix"
    },
    {
      "ticket": "LAOI061126018",
      "date": "2026-11-06T00:00:00",
      "from": "Phathaphone Phanthong",
      "code": "02076",
      "name": "S2 SNT TLA ASSY",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "BCELBANK - Xiengkhouang Branch -",
      "bank": "BCELBANK"
    },
    {
      "ticket": "LAOI061126017",
      "date": "2026-11-06T00:00:00",
      "from": "Phathaphone Phanthong",
      "code": "02064",
      "name": "S2 PICK MODULE ASSEMBLY",
      "store": "Lao-Rework",
      "qty": 2,
      "purpose": "New Order",
      "remark": "BCELBANK - Xiengkhouang Branch -",
      "bank": "BCELBANK"
    },
    {
      "ticket": "LAOI061126016",
      "date": "2026-11-06T00:00:00",
      "from": "Phathaphone Phanthong",
      "code": "02074",
      "name": "S2 F/A CARRIAGE ASSY (For SS23)",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "BCELBANK - Attapeu - 52080953 - Samakhyxay",
      "bank": "BCELBANK"
    },
    {
      "ticket": "LAOI061126015",
      "date": "2026-11-06T00:00:00",
      "from": "Phathaphone Phanthong",
      "code": "02074",
      "name": "S2 F/A CARRIAGE ASSY (For SS23)",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "BCELBANK - Xiengkhouang Branch -",
      "bank": "BCELBANK"
    },
    {
      "ticket": "LAOI061126013",
      "date": "2026-11-06T00:00:00",
      "from": "Phathaphone Phanthong",
      "code": "02067",
      "name": "S2 ASSY - REFERENCE EDGE",
      "store": "Lao-Rework",
      "qty": 1,
      "purpose": "New Order",
      "remark": "BCELBANK - Attapeu - 52080953 - Samakhyxay",
      "bank": "BCELBANK"
    }
  ],
  "fix": [
    {
      "date": "2026-10-29T00:00:00",
      "code": "04012",
      "name": "CARD READER U-IMCRW (For Selfserv)",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM291026002",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-29T00:00:00",
      "code": "08292",
      "name": "S2 PINCH ROLLER SHAFT ASSY (For SS23)",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Suok reuse part in the RW",
      "ticket": "LAOM291026004",
      "who": "Souk",
      "work": "Suok reuse part in the RW"
    },
    {
      "date": "2026-10-29T00:00:00",
      "code": "02067",
      "name": "S2 ASSY - REFERENCE EDGE",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 6,
      "status": "Waiting",
      "purpose": "",
      "remark": "Suok fix parts in the RW",
      "ticket": "LAOM291026006",
      "who": "Souk",
      "work": "Suok fix parts in the RW"
    },
    {
      "date": "2026-10-29T00:00:00",
      "code": "05009",
      "name": "FDK 15IN A/G ASM (For Selfserv)",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 5,
      "status": "Waiting",
      "purpose": "",
      "remark": "Khoun rechecked parts in the RW",
      "ticket": "LAOM291026006",
      "who": "Khoun",
      "work": "Khoun rechecked parts in the RW"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03013",
      "name": "RECEIPT TRANSPORT ONLY-PRINT ENGINE",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026002",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03017",
      "name": "RECEIPT ONLY-PAPER HOPPER",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026004",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03016",
      "name": "RECEIPT-SINGLE PAPER HOPPER",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026006",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03016",
      "name": "RECEIPT-SINGLE PAPER HOPPER",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026008",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03013",
      "name": "RECEIPT TRANSPORT ONLY-PRINT ENGINE",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026010",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03017",
      "name": "RECEIPT ONLY-RECEIPT",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026012",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03013",
      "name": "RECEIPT TRANSPORT ONLY-PRINT ENGINE",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026014",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03017",
      "name": "RECEIPT ONLY-RECEIPT",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026016",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "03016",
      "name": "PAPER HOPPER RECEIPT-SINGLE",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 1,
      "status": "Confirmed",
      "purpose": "",
      "remark": "Fix",
      "ticket": "LAOM301026018",
      "who": "Fix",
      "work": "Fix"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "02030",
      "name": "PCB-PICK I/F DOUBLE",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 14,
      "status": "Waiting",
      "purpose": "",
      "remark": "Khamla fix part in the RW",
      "ticket": "LAOM301026020",
      "who": "Khamla",
      "work": "Khamla fix part in the RW"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "08054",
      "name": "GUIDE-NOTE STACK (NID for P77)",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 2,
      "status": "Waiting",
      "purpose": "",
      "remark": "Khamla checked part in the RW",
      "ticket": "LAOM301026020",
      "who": "Khamla",
      "work": "Khamla checked part in the RW"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "08112",
      "name": "GUIDE EXIT UPPER RH",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 3,
      "status": "Waiting",
      "purpose": "",
      "remark": "Khamla checked part in the RW",
      "ticket": "LAOM301026020",
      "who": "Khamla",
      "work": "Khamla checked part in the RW"
    },
    {
      "date": "2026-10-30T00:00:00",
      "code": "08113",
      "name": "GUIDE-EXIT UPER LH",
      "sender": "",
      "fromStore": "Lao-Rework",
      "toStore": "Lao-usable",
      "qty": 3,
      "status": "Waiting",
      "purpose": "",
      "remark": "Khamla checked part in the RW",
      "ticket": "LAOM301026020",
      "who": "Khamla",
      "work": "Khamla checked part in the RW"
    }
  ]
};

const DEFAULT_WEEKLY_SUMMARY = [{
  week: '2026-10-19',
  headers: ['Metric', 'RW_HN', 'RW_HCM', 'RW_ĐN', 'RW_LAO', 'RW_CAM', 'Part In/Fix this week'],
  rows: [
    ['Total %', '641 / 627', '645 / 636', '186 / 172', '53 / 40', '14-Dec', '16 / 17'],
    ['Part In / Part Fixed', '97,8%', '98,6 %', '92,5 %', '75,5 %', '116%', '94,1%'],
    ['Total %', '6 / 627', '6 / 636', '1 / 172', '0 / 40', '0 / 14', '0 / 17'],
    ['Part Error / Part Fixed', '0,96 %', '0,94 %', '0,58 %', '%', '%', '%']
  ]
}];

const DEFAULT_REWORK_SERVICE = [
  {
    "week": "2026-10-19",
    "label": "19/10/2026 – 24/10/2026",
    "people": [
      {
        "name": "Khoun",
        "onsite": 2,
        "remote": 2,
        "help": 0,
        "delivery": 2,
        "total": 6,
        "remarks": [
          {
            "text": "1. Remote support LVB, Seno Unit, Savannakhet PV, Clear card shutter jam.",
            "date": "19.10.2026"
          },
          {
            "text": "2. Delivery part to support LVB, Seno Unit, Savannakhet PV at Hongaroun.",
            "date": "19.10.2026"
          },
          {
            "text": "3. Onsite service BCEL Syvilay Unit, VTE clear card jam.",
            "date": "20.10.2026"
          },
          {
            "text": "4. Onsite service BCEL SEAGAMES apartment Unit, VTE clear card jam.",
            "date": "20.10.2026"
          },
          {
            "text": "5. Remote support BCEL DonDok Univercity Unit VTE clear Power input no power 220 ACV .",
            "date": "23.10.2026"
          },
          {
            "text": "6. Delivery support part NU-MCRW stradasd shutter to support BCEL Duk Cheung Unit, Sekong PV.",
            "date": "23.10.2026"
          }
        ]
      },
      {
        "name": "Souk",
        "onsite": 0,
        "remote": 1,
        "help": 0,
        "delivery": 2,
        "total": 3,
        "remarks": [
          {
            "text": "1. Remote support BCEL Xekong to clear error of CRM at ethnic school unit ( note jammed and retract failed)",
            "date": "20.10.2026"
          },
          {
            "text": "2. Sent card reader to BCEL team pakse for replace card reader CRM campasak branch no1 unit",
            "date": "22.10.2026"
          },
          {
            "text": "3. Sent S2 SNT Drive Belt to BCEL team pakse for fix ATM S2 Dsipenser",
            "date": "22.10.2026"
          }
        ]
      },
      {
        "name": "Khamla",
        "onsite": 0,
        "remote": 1,
        "help": 1,
        "delivery": 1,
        "total": 3,
        "remarks": [
          {
            "text": "1. Sent card reader and reciept printer to LVB Savannakhet.",
            "date": "21.10.2026"
          },
          {
            "text": "2. Remote support LVB Khammuan \"double pick (pick failure type2).",
            "date": "22.10.2026"
          },
          {
            "text": "3. Help BCEL Check PC Core ATM test Phonthan warehouse \"mainboard has problem\".",
            "date": "23.10.2026"
          }
        ]
      }
    ],
    "tasks": [
      {
        "person": "Khoun",
        "type": "Remote support",
        "remark": "Remote support LVB, Seno Unit, Savannakhet PV, Clear card shutter jam.",
        "date": "2026-10-19"
      },
      {
        "person": "Khoun",
        "type": "Delivery",
        "remark": "Delivery part to support LVB, Seno Unit, Savannakhet PV at Hongaroun.",
        "date": "2026-10-19"
      },
      {
        "person": "Khoun",
        "type": "Onsite Service",
        "remark": "Onsite service BCEL Syvilay Unit, VTE clear card jam.",
        "date": "2026-10-20"
      },
      {
        "person": "Khoun",
        "type": "Onsite Service",
        "remark": "Onsite service BCEL SEAGAMES apartment Unit, VTE clear card jam.",
        "date": "2026-10-20"
      },
      {
        "person": "Khoun",
        "type": "Remote support",
        "remark": "Remote support BCEL DonDok Univercity Unit VTE clear Power input no power 220 ACV .",
        "date": "2026-10-23"
      },
      {
        "person": "Khoun",
        "type": "Delivery",
        "remark": "Delivery support part NU-MCRW stradasd shutter to support BCEL Duk Cheung Unit, Sekong PV.",
        "date": "2026-10-23"
      },
      {
        "person": "Souk",
        "type": "Remote support",
        "remark": "Remote support BCEL Xekong to clear error of CRM at ethnic school unit ( note jammed and retract failed)",
        "date": "2026-10-20"
      },
      {
        "person": "Souk",
        "type": "Delivery",
        "remark": "Sent card reader to BCEL team pakse for replace card reader CRM campasak branch no1 unit",
        "date": "2026-10-22"
      },
      {
        "person": "Souk",
        "type": "Delivery",
        "remark": "Sent S2 SNT Drive Belt to BCEL team pakse for fix ATM S2 Dsipenser",
        "date": "2026-10-22"
      },
      {
        "person": "Khamla",
        "type": "Delivery",
        "remark": "Sent card reader and reciept printer to LVB Savannakhet.",
        "date": "2026-10-21"
      },
      {
        "person": "Khamla",
        "type": "Remote support",
        "remark": "Remote support LVB Khammuan \"double pick (pick failure type2).",
        "date": "2026-10-22"
      },
      {
        "person": "Khamla",
        "type": "Help bank fix",
        "remark": "Help BCEL Check PC Core ATM test Phonthan warehouse \"mainboard has problem\".",
        "date": "2026-10-23"
      }
    ]
  }
];

const DEFAULT_PART_SHORT_REQUESTS = [
  {
    "id": "sr1",
    "bank": "BCEL",
    "dateOut": "2026-07-27",
    "dateIn": "",
    "code": "04012",
    "part": "U-IMCRW",
    "qty": 1,
    "error": "Shutter jam",
    "serial": "46084297",
    "location": "Luangprabang branch",
    "fixBy": "Khoun",
    "remarks": "On Tuesday11.08.2026 Mr. Axong onsile service adjust swicth shutter"
  },
  {
    "id": "sr2",
    "bank": "BCEL",
    "dateOut": "2024-08-10",
    "dateIn": "2026-08-17",
    "code": "04012",
    "part": "U-IMCRW",
    "qty": 1,
    "error": "Shutter jam",
    "serial": "50793094",
    "location": "Sisaket unit",
    "fixBy": "Khoun",
    "remarks": "On Monday 17.08.2026 place new card to Mr. Retou.(Track sensor failed)"
  },
  {
    "id": "sr3",
    "bank": "BCEL",
    "dateOut": "2026-07-03",
    "dateIn": "",
    "code": "04012",
    "part": "U-IMCRW",
    "qty": 1,
    "error": "card not detect",
    "serial": "46084310",
    "location": "Oudomxay Branch",
    "fixBy": "Khoun",
    "remarks": "On Wednesday  19.08.2026, Bank infrom Mr.Souk, Supprt Bank clear switch 3 on board."
  },
  {
    "id": "sr4",
    "bank": "BCEL",
    "dateOut": "2026-08-11",
    "dateIn": "",
    "code": "02076",
    "part": "S2 SNT",
    "qty": 1,
    "error": "Lock sensor broken",
    "serial": "58375906",
    "location": "Huaphan Branch",
    "fixBy": "Khamla",
    "remarks": "On Wednesday 19.08.2026 Send new SNT to bank for replace (during transport at HAL)"
  }
];
