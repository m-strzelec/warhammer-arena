import { Card } from 'react-bootstrap';

const FightLog = ({ fightLog, char1Name, char2Name }) => {
  const getLogStyle = (log, currentCharacter) => {
    const style = { fontWeight: 'bold' };

    if (log.includes('hits')) style.color = 'green';
    else if (log.includes('misses')) style.color = '#9b30ff'; // purple
    else if (log.includes('dodges')) style.color = '#6cbdff';
    else if (log.includes('parries')) style.color = 'orange';
    else if (log.includes('Ulric')) style.color = 'crimson';

    if (log.startsWith(char1Name)) {
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

  return (
    <Card className="mb-4">
      <Card.Body>
        {fightLog.map((log, index) => {
          const { style, currentCharacter: newCharacter } = getLogStyle(log, currentCharacter);
          currentCharacter = newCharacter;

          return (
            <p key={index} style={style}>
              {highlightNumbers(log)}
            </p>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default FightLog;