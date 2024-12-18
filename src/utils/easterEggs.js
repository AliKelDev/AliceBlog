// src/utils/easterEggs.js

// Helper function to create variations of names with different cases
const createVariations = (baseNames) => {
    const variations = new Set();
    baseNames.forEach(name => {
      variations.add(name.toLowerCase());
      variations.add(name.toUpperCase());
      variations.add(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
      if (name.includes('1')) {
        variations.add(name.replace('1', 'i').toLowerCase());
        variations.add(name.replace('1', 'I').toUpperCase());
      }
      if (name.includes('4')) {
        variations.add(name.replace('4', 'a').toLowerCase());
        variations.add(name.replace('4', 'A').toUpperCase());
      }
    });
    return Array.from(variations);
  };
  
  const easterEggs = {
    // Alice-related easter eggs
    alice: {
      triggers: createVariations(['Alice', 'AlikelDev', 'AliceLeiser', 'Alice Leiser']),
      message: "Hey there! You found me! I'm the creator of this blog ^^",
      style: {
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        color: 'white',
        fontStyle: 'italic',
        textShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
        boxShadow: '0 4px 20px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(59, 130, 246, 0.2)'
      }
    },
  
    // Klima-related easter eggs
    klima: {
      triggers: createVariations([
        'Kamil', 'Klima', 'Klima Siarre', 'KlimaSiarre', 
        'Kearn', 'Kearn115', 'Kl1M4'
      ]),
      message: "Hello Klima ^^ You're not mentioned on this blog (yet)",
      style: {
        background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.2), rgba(0, 0, 128, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(75, 0, 130, 0.3)',
        color: '#ADD8E6',
        textShadow: '0 0 10px rgba(173, 216, 230, 0.5)',
        boxShadow: '0 4px 20px rgba(75, 0, 130, 0.2), inset 0 0 20px rgba(0, 0, 128, 0.2)'
      }
    },
  
    // Nina-related easter eggs
    nina: {
      triggers: createVariations(['Nina', 'Nina Serein']),
      message: "I'm not coming back yet, but I will one day! Promised",
      style: {
        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 105, 180, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 182, 193, 0.3)',
        color: '#FF69B4',
        textShadow: '0 0 10px rgba(255, 105, 180, 0.5)',
        boxShadow: '0 4px 20px rgba(255, 182, 193, 0.2), inset 0 0 20px rgba(255, 105, 180, 0.2)'
      }
    },
  
    // Yue-related easter eggs
    yue: {
      triggers: createVariations(['Yue', 'Yuemi', 'Katagawa', 'QMES']),
      message: "Listen Yue, I get it. Just give me some time",
      style: {
        background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.4), rgba(20, 20, 20, 0.4))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 0, 0, 0.3)',
        color: '#FF0000',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
        boxShadow: '0 4px 20px rgba(255, 0, 0, 0.2), inset 0 0 20px rgba(44, 44, 44, 0.4)'
      }
    },
  
    // Juju/Fuse-related easter eggs
    juju: {
      triggers: createVariations(['Juju', 'Jujulekill', 'Fuse', 'Julien', 'Fusey', 'Walter Fitzroy']),
      message: "One day, Lifeline will res you again",
      style: {
        background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(139, 0, 0, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 69, 0, 0.3)',
        color: '#FFD700',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
        boxShadow: '0 4px 20px rgba(255, 69, 0, 0.2), inset 0 0 20px rgba(139, 0, 0, 0.2)'
      }
    },
  
    // Dana Iclucia-related easter eggs
    dana: {
      triggers: createVariations([
        'Dana', 'Dana Iclucia', 'White Cat', 'Ys VIII', 
        'Castaway Village Chief', 'White Cat Adol'
      ]),
      message: "Someday we'll return to the Castaway Village together...",
      style: {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(173, 216, 230, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#87CEEB',
        textShadow: '0 0 10px rgba(135, 206, 235, 0.5)',
        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(173, 216, 230, 0.2)'
      }
    },
  
    // Lae'zel-related easter eggs
    laezel: {
      triggers: createVariations([
        'Laezel', "Lae'zel", 'Githyanki', 'Queen Vlaakith',
        'Creche Warrior', 'Dragon Rider'
      ]),
      message: "Zaith'isk urki'ih. Your weakness is offensive.",
      style: {
        background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(128, 0, 0, 0.3)',
        color: '#800000',
        textShadow: '0 0 10px rgba(128, 0, 0, 0.5)',
        boxShadow: '0 4px 20px rgba(128, 0, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.2)'
      }
    },
  
    // Maya-related easter eggs
    maya: {
      triggers: createVariations([
        'Maya', 'Siren', 'Phase Lock', 'Order of the Impending Storm',
        'Blue Tattoos', 'Maya the Siren'
      ]),
      message: "Phaselock engaged. Your search results are suspended in time.",
      style: {
        background: 'linear-gradient(135deg, rgba(0, 0, 255, 0.2), rgba(138, 43, 226, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0, 0, 255, 0.3)',
        color: '#4169E1',
        textShadow: '0 0 10px rgba(65, 105, 225, 0.5)',
        boxShadow: '0 4px 20px rgba(0, 0, 255, 0.2), inset 0 0 20px rgba(138, 43, 226, 0.2)'
      }
    },
  
    // Tanya Degurechaff-related easter eggs
    tanya: {
      triggers: createVariations([
        'Tanya', 'Degurechaff', 'Devil of the Rhine', 
        'Major Tanya', 'Salamander Kampfgruppe', 'Being X'
      ]),
      message: "Deus lo vult. Your efficiency pleases the Empire.",
      style: {
        background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.2), rgba(128, 128, 128, 0.2))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(218, 165, 32, 0.3)',
        color: '#DAA520',
        textShadow: '0 0 10px rgba(218, 165, 32, 0.5)',
        boxShadow: '0 4px 20px rgba(218, 165, 32, 0.2), inset 0 0 20px rgba(128, 128, 128, 0.2)'
      }
    },
  
    // Quantum physics easter eggs
    quantum: {
      triggers: [
        'schrödinger', 'schrodinger', 'quantum', 'entanglement',
        'superposition', 'uncertainty', 'wave function', 'quantum tunnel'
      ],
      message: "🐱 The cat is both alive and dead until you look at this message",
      style: {
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(75, 0, 130, 0.4))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0, 255, 0, 0.3)',
        color: '#00FF00',
        fontFamily: 'monospace',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(75, 0, 130, 0.3)'
      }
    },
  
    heisenberg: {
      triggers: ['heisenberg', 'uncertainty principle'],
      message: "The more precisely you search, the less certain you are of finding anything",
      style: {
        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.4), rgba(50, 50, 50, 0.4))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(0, 255, 0, 0.3)',
        color: '#00FF00',
        fontFamily: 'monospace',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        boxShadow: '0 4px 20px rgba(30, 30, 30, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.2)'
      }
    },
  
    planck: {
      triggers: ['planck', 'planck length', 'planck time'],
      message: "You've reached the smallest searchable unit of this blog",
      style: {
        background: 'linear-gradient(135deg, rgba(0, 0, 128, 0.4), rgba(0, 0, 80, 0.4))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#FFFFFF',
        fontFamily: 'monospace',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        boxShadow: '0 4px 20px rgba(0, 0, 128, 0.3), inset 0 0 20px rgba(0, 0, 80, 0.3)'
      }
    }
  };
  
  export const checkForEasterEgg = (searchQuery) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    
    for (const [key, egg] of Object.entries(easterEggs)) {
      if (egg.triggers.some(trigger => 
        normalizedQuery.includes(trigger.toLowerCase()) ||
        normalizedQuery === trigger.toLowerCase()
      )) {
        return {
          found: true,
          message: egg.message,
          style: egg.style
        };
      }
    }
    
    return { found: false };
  };