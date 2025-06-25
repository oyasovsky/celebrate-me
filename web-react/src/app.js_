import React from 'https://unpkg.com/react@18/umd/react.development.js';
import ReactDOM from 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
} from 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.development.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

const firebaseConfig = {
  // TODO: replace with your config
};
initializeApp(firebaseConfig);
const db = getFirestore();

const personas = [
  { title: 'Patch Mage', desc: 'Conjurer of hotfixes' },
  { title: 'Bug Whisperer', desc: 'Listens to stack traces' },
  { title: 'PR Warrior', desc: 'Defender of code reviews' },
];

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function Landing() {
  const { name } = useParams();
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Birthday Protocol Activated for {name}</h1>
      <button onClick={() => navigate('scan')}>Begin the Ritual</button>
    </div>
  );
}

function Scan() {
  const navigate = useNavigate();
  const stats = {
    mergeResistance: Math.floor(Math.random() * 100),
    slackSpeed: Math.floor(Math.random() * 100),
    burnout: Math.floor(Math.random() * 100),
  };
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Scanning Dev DNA...</h2>
      <p>Merge Conflict Resistance: {stats.mergeResistance}%</p>
      <p>Slack Typing Speed: {stats.slackSpeed} wpm</p>
      <p>Burnout Level: {stats.burnout}%</p>
      <button onClick={() => navigate('../persona', { state: { stats } })}>Accept My Fate</button>
    </div>
  );
}

function Persona() {
  const navigate = useNavigate();
  const persona = randomItem(personas);
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{persona.title}</h2>
      <p>{persona.desc}</p>
      <button onClick={() => navigate('../trial', { state: { persona } })}>Reveal My Birthday Trials</button>
    </div>
  );
}

const trials = [
  'Debug the build without coffee',
  'Push to main on Friday afternoon',
  'Merge a massive PR unseen',
];

const outcomes = [
  'Prod exploded. QA just quit.',
  'All tests passed magically.',
  'A wild merge conflict appeared!',
];

function Trial() {
  const navigate = useNavigate();
  const [outcome, setOutcome] = React.useState(null);
  function pickTrial(t) {
    setOutcome(randomItem(outcomes));
  }
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Choose your absurd challenge</h2>
      {trials.map((t) => (
        <p key={t}>
          <button onClick={() => pickTrial(t)}>{t}</button>
        </p>
      ))}
      {outcome && (
        <div>
          <p>{outcome}</p>
          <button onClick={() => navigate('../scroll', { state: { outcome } })}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

const scrolls = [
  'May your commits be ever blessed.',
  'The release gods favor you today.',
  'Bug demons flee before your IDE.',
];

function Scroll() {
  const navigate = useNavigate();
  const message = randomItem(scrolls);
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Scroll of Honor</h2>
      <p>{message}</p>
      <button
        onClick={async () => {
          const params = new URLSearchParams(window.location.search);
          const id = params.get('id');
          const name = window.location.pathname.split('/')[2];
          await setDoc(doc(db, 'celebrations', id), { finalMessage: message }, { merge: true });
          navigator.clipboard.writeText(message);
          alert('Copied to clipboard');
        }}
      >
        Copy to Slack
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="celebrate/:name" element={<Landing />} />
        <Route path="celebrate/:name/scan" element={<Scan />} />
        <Route path="celebrate/:name/persona" element={<Persona />} />
        <Route path="celebrate/:name/trial" element={<Trial />} />
        <Route path="celebrate/:name/scroll" element={<Scroll />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

