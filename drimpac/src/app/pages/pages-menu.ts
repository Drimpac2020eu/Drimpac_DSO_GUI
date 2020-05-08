import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Welcome Screen',
    icon: 'settings-2-outline',
    link: '/pages/welcome-screen',
    hidden: true,
    home: true,
  },
  {
    title: 'User Administration',
    icon: 'people-outline',
    link: '/pages/user-administration',
  },
 // {
  //  title: 'Aggregator Management',
   // icon: 'grid-outline',
    //children: [
     // {
      //  title: 'Add Unit',
       // link: '/pages/unit-management/unit-add',
      //},
     // {
      //  title: 'Edit Unit',
       // link: '/pages/unit-management/unit-edit',
      //},
     // {
      //  title: 'Delete Unit',
       // link: '/pages/unit-management/unit-delete',
      //},
      //{
      //  title: 'Available Aggregators',
       // link: '/pages/unit-management/unit-available',
      //},
    //],
  //},
  // {
  //   title: 'Common Reference Operator',
  //   icon: 'grid-outline',
  //   children: [
  //     {
  //       title: 'Add CRO',
  //       link: '/pages/commonreferenceoperators/cro-add',
  //     },
  //     {
  //       title: 'Delete CRO',
  //       link: '/pages/commonreferenceoperators/cro-delete',
  //     },
  //   ],
  // },
  {
    title: 'Manage Congestion Points',
    icon: 'shake-outline',
    children: [
      {
        title: 'Add Congestion Point',
        link: '/pages/congestionpoints/congestion-add',
      },
      // {
      //   title: 'Add DRMS Cong&Conn points',
      //   link: '/pages/congestionpoints/drmscongestions',
      // },
      {
        title: 'Delete Congestion Point',
        link: '/pages/congestionpoints/congestion-delete',
      },
    ],
  },
  {
    title: 'Active Participants',
    icon: 'grid-outline',
      children: [
      {
        title: 'Active Congestion Points',
  //  icon: 'grid-outline',
        link: '/pages/activecongestions',
      },
      {
        title: 'Active Aggregators',
//    icon: 'grid-outline',
        link: '/pages/activeaggregators',
      },
  ],
  },
   {
     title: 'Events',
     icon: 'grid-outline',
     link: '/pages/events',
   },

 // {
  //  title: 'Test Connection',
   // icon: 'grid-outline',
    //link: '/pages/testmessage',
  //},
  //{
   // title: 'Congestion Points',
    //icon: 'grid-outline',
    //link: '/pages/points',
  //},
  //{
   // title: 'Prognosis',
    //icon: 'grid-outline',
    //link: '/pages/prognosis',
  //},
  {
    title: 'Manual Override Commands',
    icon: 'monitor-outline',
    link: '/pages/commands',
  },

  {
    title: 'Parameters',
    icon: 'settings-outline',
    link: '/pages/usefParameters',
  },
 // {
 //   title: 'Configuration File',
  //  icon: 'grid-outline',
  //  link: '/pages/configfile',
 // },
  {
    title: 'Flexibility Request',
    icon: 'activity',
    link: '/pages/flexRequest',
  },
  {
    title: 'Flexibility Offer Management',
    icon: 'globe-outline',
    children: [
      {
        title: 'Accepted Offers',
      
        link: '/pages/flexOfferRevoke',
      },
  {
    title: 'Pending Offers',
  
    link: '/pages/flexOrder',
  },
  {
    title: 'Rejected Offers',
    
    link: '/pages/flexOrder2',
  },
  {
    title: 'Revoked Offers',
  
    link: '/pages/flexOrder3',
  },
  
    ],
  }
  ,
  /*{
    title: 'VENs',
    icon: { icon: 'ven', pack: 'open-adr' },
    link: '/pages',
  },
  {
    title: 'Accounts',
    icon: 'people-outline',
    link: '/pages',
  },
  {
    title: 'Status & Export',
    icon: 'clipboard-outline',
    link: '/pages',
    children: [
      {
        title: 'Status',
        link: '/pages',
      },
      {
        title: 'Export',
        link: '/pages',
      },
    ],
  },
  {
    title: 'Configuration',
    group: true,
  },
  {
    title: 'VTN Config',
    icon: { icon: 'vtn', pack: 'open-adr' },
    link: '/pages',
    children: [
      {
        title: 'Market Contexts',
        link: '/pages',
      },
      {
        title: 'Targets',
        link: '/pages',
      },
      {
        title: 'Units',
        link: '/pages',
      },
      {
        title: 'VTN Parameters',
        link: '/pages',
      },
      {
        title: 'Test Cases Prompts',
        link: '/pages',
      },
      {
        title: 'Report Request Configurations',
        link: '/pages',
      },
    ],
  },
  {
    title: 'TOU Schedules',
    icon: 'calendar-outline',
    link: '/pages',
    children: [
      {
        title: 'Time of Use Schedules',
        link: '/pages',
      },
      {
        title: 'Holidays',
        link: '/pages',
      },
    ],
  },
  {
    title: 'Downloadable',
    group: true,
  },
  {
    title: 'Download VEN',
    icon: { icon: 'ven', pack: 'open-adr' },
    link: '/pages',
  },*/
];
