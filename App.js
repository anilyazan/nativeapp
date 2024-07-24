import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback } from 'react-native';

// iPhone 11 boyutları
const { width, height } = Dimensions.get('window');
const snakeSize = width / 20; // Yılan boyutunu ekran genişliğinin 20'de biri olarak ayarlıyoruz
const foodSize = width / 20;  // Yiyecek boyutunu ekran genişliğinin 20'de biri olarak ayarlıyoruz

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * (width / snakeSize)) * snakeSize,
    y: Math.floor(Math.random() * (height / snakeSize)) * snakeSize,
  };
};

const App = () => {
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);

  const moveSnake = () => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      switch (direction) {
        case 'UP':
          head.y -= snakeSize;
          break;
        case 'DOWN':
          head.y += snakeSize;
          break;
        case 'LEFT':
          head.x -= snakeSize;
          break;
        case 'RIGHT':
          head.x += snakeSize;
          break;
      }

      // Ekran sınırlarıyla çarpışmayı kontrol et
      if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
        // Sınırlarla çarpışırsa oyunu sıfırla
        setSnake([{ x: 0, y: 0 }]);
        setFood(getRandomPosition());
        setScore(0);
        return [{ x: 0, y: 0 }];
      }

      const newSnake = [head, ...prevSnake.slice(0, -1)];

      // Yiyecek ile çarpışmayı kontrol et
      if (head.x === food.x && head.y === food.y) {
        setFood(getRandomPosition());
        setScore(score + 1);
        return [head, ...prevSnake];
      }

      return newSnake;
    });
  };

  const handleKeyPress = (e) => {
    switch (e.nativeEvent.key) {
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(moveSnake, 200);

    return () => clearInterval(intervalRef.current);
  }, [direction]);

  return (
    <TouchableWithoutFeedback onPress={(e) => handleKeyPress(e)}>
      <View style={styles.container}>
        <View style={[styles.food, { left: food.x, top: food.y }]} />
        {snake.map((segment, index) => (
          <View
            key={index}
            style={[styles.snake, { left: segment.x, top: segment.y }]}
          />
        ))}
        <Text style={styles.score}>Score: {score}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  snake: {
    width: snakeSize,
    height: snakeSize,
    backgroundColor: 'green',
    position: 'absolute',
  },
  food: {
    width: foodSize,
    height: foodSize,
    backgroundColor: 'red',
    position: 'absolute',
  },
  score: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App; 
