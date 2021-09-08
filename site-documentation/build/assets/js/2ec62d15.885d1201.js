"use strict";(self.webpackChunksite_documentation=self.webpackChunksite_documentation||[]).push([[679],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=i,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7909:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),o=["components"],s={sidebar_position:1},l="Services Overview",c={unversionedId:"backend/services-overview",id:"backend/services-overview",isDocsHomePage:!1,title:"Services Overview",description:"Golf4Bob uses the following services for proper site operation",source:"@site/docs/backend/services-overview.md",sourceDirName:"backend",slug:"/backend/services-overview",permalink:"/docs/backend/services-overview",editUrl:"https://github.com/rajanphadnis/Golf_Event_Platform/edit/main/site-documentation/docs/backend/services-overview.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Stripe - Some Notes",permalink:"/docs/admin-site/stripe"},next:{title:"All Things Users",permalink:"/docs/backend/users"}},u=[{value:"Paid Services",id:"paid-services",children:[]},{value:"Firebase Services Overview",id:"firebase-services-overview",children:[{value:"Firestore Database",id:"firestore-database",children:[]},{value:"Firestore Storage",id:"firestore-storage",children:[]},{value:"Firebase Cloud Functions",id:"firebase-cloud-functions",children:[]},{value:"Firebase Hosting",id:"firebase-hosting",children:[]}]},{value:"Algolia Search",id:"algolia-search",children:[]},{value:"Stripe Payment Processing",id:"stripe-payment-processing",children:[]}],p={toc:u};function d(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"services-overview"},"Services Overview"),(0,a.kt)("p",null,"Golf4Bob uses the following services for proper site operation"),(0,a.kt)("h2",{id:"paid-services"},"Paid Services"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Firebase:"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Firebase Firestore Database"),(0,a.kt)("li",{parentName:"ul"},"Firebase Storage"),(0,a.kt)("li",{parentName:"ul"},"Firebase Cloud Functions"),(0,a.kt)("li",{parentName:"ul"},"Firebase Hosting"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Algolia Search")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Stripe Payment Processing"))),(0,a.kt)("h2",{id:"firebase-services-overview"},"Firebase Services Overview"),(0,a.kt)("p",null,"Firebase and Google Cloud products are billed on the ",(0,a.kt)("a",{parentName:"p",href:"https://firebase.google.com/pricing"},"Blaze")," (Pay as you go) Plan."),(0,a.kt)("h3",{id:"firestore-database"},"Firestore Database"),(0,a.kt)("p",null,"Firestore Database has just 6 main collections (or groups), and each collection serves a separate purpose."),(0,a.kt)("div",{className:"admonition admonition-danger alert alert--danger"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"Editing")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Do not - under any circumstances - manually edit the contents of these collections. Do not change any permissions directly regarding these collections or its contents without consulting this documentation and the site's creator. Doing so can negatively impact both site's standard functions and performance."))),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"_firebase_ext_"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"A collection that is automatically managed by Firebase Cloud Functions"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"admin"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"A collection that stores general site information and admin settings"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"archivedUsers"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"A collection that stores the profiles of users (charities and standard users) who are no longer subscribed to the MAIN SITE, but have not deleted their account"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"pastEvents"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"A collection that stores details of past events created by charities"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"upcomingEvents"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"A collection that stores details regarding upcoming events created by charities"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"users"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"A collection that stores information about active users on the main site")))),(0,a.kt)("h3",{id:"firestore-storage"},"Firestore Storage"),(0,a.kt)("p",null,'Firestore Storage is used solely for storing event "posters". However, Firebase Cloud Functions build artifacts are often automatically stored in Firebase Storage, and can be deleted.'),(0,a.kt)("h3",{id:"firebase-cloud-functions"},"Firebase Cloud Functions"),(0,a.kt)("p",null,"All instances of functions deployed via Firebase Cloud Functions use the latest supported Node.js version (Node.js 10)."),(0,a.kt)("p",null,"Some functions are deployed and controlled via ",(0,a.kt)("a",{parentName:"p",href:"https://firebase.google.com/products/extensions"},"Firebase Extensions"),", and cannot be individually configured beyond Firebase Extension Configuration. These functions include one Algolia Search Term scraper function, and three functions related to shard counting (counting really fast)."),(0,a.kt)("h3",{id:"firebase-hosting"},"Firebase Hosting"),(0,a.kt)("p",null,"Firebase Hosting is the primary hosting platform used by Golf4Bob. It is expected to remain free until significant usage begins upon product launch."),(0,a.kt)("p",null,"Firebase Hosting has an automatically deployed (from GitHub Actions) ",(0,a.kt)("a",{parentName:"p",href:"https://golf-event-platform--dev-u2suwtdi.web.app/"},"dev site")," that is publically accessible through the default Firebase Project."),(0,a.kt)("h2",{id:"algolia-search"},"Algolia Search"),(0,a.kt)("p",null,"Algolia Search is to be implemented in the coming weeks"),(0,a.kt)("h2",{id:"stripe-payment-processing"},"Stripe Payment Processing"),(0,a.kt)("p",null,'Using Stripe\'s "Connect" platform, Golf4Bob is able to set up charity portals and easily accept, manage, and transfer funds between accounts with few fees and low development time. '),(0,a.kt)("p",null,"Payment processing is always triggered from a Firebase Cloud Function, and can be tracked from the ",(0,a.kt)("a",{parentName:"p",href:"https://dashboard.stripe.com/dashboard"},"Golf4Bob Stripe Dashboard"),"."))}d.isMDXComponent=!0}}]);