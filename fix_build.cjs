const fs = require('fs');

// Fix BusinessSelection.tsx marquee
let bs = fs.readFileSync('src/pages/BusinessSelection.tsx', 'utf-8');
const marqueeRegex = /<marquee scrollamount="5" style={{ fontSize: '1rem', fontWeight: 500 }}>{settings\.announcement}<\/marquee>/g;
const cssMarquee = `
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box' }}>
               <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 15s linear infinite', fontSize: '1rem', fontWeight: 500 }}>
                 {settings.announcement}
               </div>
               <style>{\`
                 @keyframes marquee {
                   0%   { transform: translate(0, 0); }
                   100% { transform: translate(-100%, 0); }
                 }
               \`}</style>
            </div>
`;
bs = bs.replace(marqueeRegex, cssMarquee);
fs.writeFileSync('src/pages/BusinessSelection.tsx', bs);

// Fix TestPage.tsx unused import
let tp = fs.readFileSync('src/pages/TestPage.tsx', 'utf-8');
tp = tp.replace("import { getBusinesses, getSettings, saveDataLocally } from '../services/dataService';", "import { getBusinesses, saveDataLocally } from '../services/dataService';");
fs.writeFileSync('src/pages/TestPage.tsx', tp);

console.log('Fixed build issues.');
