import { Card } from 'react-bootstrap';

const FightLog = ({ fightLog, char1Name, char2Name }) => {
  const getLogStyle = (log, currentCharacter) => {
    const style = { fontWeight: 'bold' };

    if (log.includes('hits')) style.color = 'green';
    if (log.includes('misses')) style.color = '#9b30ff'; // purple
    if (log.includes('dodges')) style.color = 'blue';

    if (log.includes('misses')) {
      if (log.startsWith(char1Name)) {
        style.backgroundColor = 'rgba(0, 128, 0, 0.1)'; // light green for Character 1
      } else if (log.startsWith(char2Name)) {
        style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // light red for Character 2
      }
    } else if (log.includes('dodges')) {
      if (log.startsWith(char1Name)) {
        style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // light red for Character 2
      } else if (log.startsWith(char2Name)) {
        style.backgroundColor = 'rgba(0, 128, 0, 0.1)'; // light green for Character 1
      }
    } else if (log.startsWith(char1Name)) {
      style.backgroundColor = 'rgba(0, 128, 0, 0.1)'; // light green for Character 1
      currentCharacter = char1Name;
    } else if (log.startsWith(char2Name)) {
      style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // light red for Character 2
      currentCharacter = char2Name;
    } else if (currentCharacter === char1Name) {
      style.backgroundColor = 'rgba(0, 128, 0, 0.1)'; // light green for Character 1
    } else if (currentCharacter === char2Name) {
      style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // light red for Character 2
    }
    return { style, currentCharacter };
  };

  const highlightNumbers = (text) => {
    return text.split(/(-?\d+)/).map((part, index) =>
      /-?\d/.test(part) ? (
        <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  let currentCharacter = null;
  let skipNext = false;

  return(
    <Card className="mb-4">
      <Card.Body>
        {fightLog.slice(0, -2).map((log, index) => {
          if (skipNext) {
            skipNext = false;
            return (
              <p 
                key={index} 
                style={{ fontWeight: 'bold', backgroundColor: currentCharacter === char1Name ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)' }}>
                {highlightNumbers(log)}
              </p>
            );
          }
          const { style, currentCharacter: newCharacter } = getLogStyle(log, currentCharacter);
          currentCharacter = newCharacter;
          if (style.backgroundColor !== 'transparent' && !log.includes('misses') && !log.includes('dodges')) {
            skipNext = true;
          }
          return (
            <p key={index} style={style}>
              {highlightNumbers(log)}
            </p>
          );
        })}
        {fightLog.slice(-2).map((log, index) => (
          <p key={index} style={{ fontWeight: 'bold', backgroundColor: 'transparent' }}>
            {highlightNumbers(log)}
          </p>
        ))}
      </Card.Body>
    </Card>
  );
};

export default FightLog;