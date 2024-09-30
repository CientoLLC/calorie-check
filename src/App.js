// App.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon

function FoodManager({ addFood, onClose }) {
  const [name, setName] = useState('');
  const [caloriesPerGram, setCaloriesPerGram] = useState('');
  const [proteinPerGram, setProteinPerGram] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && caloriesPerGram && proteinPerGram) {
      const food = {
        name,
        caloriesPerGram: parseFloat(caloriesPerGram),
        proteinPerGram: parseFloat(proteinPerGram),
      };
      addFood(food);
      setName('');
      setCaloriesPerGram('');
      setProteinPerGram('');
      onClose(); // Close the dialog on submit
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Food Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ marginBottom: 2 }}
        required
      />
      <TextField
        label="Calories per Gram"
        type="number"
        variant="outlined"
        fullWidth
        value={caloriesPerGram}
        onChange={(e) => setCaloriesPerGram(e.target.value)}
        sx={{ marginBottom: 2 }}
        required
      />
      <TextField
        label="Protein per Gram"
        type="number"
        variant="outlined"
        fullWidth
        value={proteinPerGram}
        onChange={(e) => setProteinPerGram(e.target.value)}
        sx={{ marginBottom: 2 }}
        required
      />
      <DialogActions>
        <Button type="submit" variant="contained" color="primary">
          Add Food
        </Button>
      </DialogActions>
    </form>
  );
}

function DailyIntake({ foods }) {
  const [dailyFood, setDailyFood] = useState(() => {
    const storedDailyIntake = JSON.parse(localStorage.getItem('dailyIntake')) || [];
    return storedDailyIntake;
  });
  const [selectedFood, setSelectedFood] = useState('');
  const [grams, setGrams] = useState('');

  // Save daily intake to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyIntake', JSON.stringify(dailyFood));
  }, [dailyFood]);

  const addDailyFood = () => {
    const food = foods.find((f) => f.name === selectedFood);
    if (food && grams) {
      const intake = {
        id: Date.now(), // Use timestamp as a unique ID
        name: food.name,
        grams: parseFloat(grams),
        calories: food.caloriesPerGram * grams,
        protein: food.proteinPerGram * grams,
        time: new Date().toLocaleTimeString(), // Add time for each entry
      };
      setDailyFood([...dailyFood, intake]);
      setGrams('');
    }
  };

  const deleteDailyEntry = (id) => {
    const updatedDailyFood = dailyFood.filter((item) => item.id !== id);
    setDailyFood(updatedDailyFood); // Update dailyFood and localStorage
  };

  const resetDailyIntake = () => {
    setDailyFood([]);
    localStorage.removeItem('dailyIntake'); // Clear from localStorage as well
  };

  const totalCalories = dailyFood.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = dailyFood.reduce((acc, item) => acc + item.protein, 0);

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
        Daily Calories and Protein Intake
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2, mt: 1.2 }}>
        <InputLabel>Select Food</InputLabel>
        <Select value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}>
          {foods.map((food) => (
            <MenuItem key={food.name} value={food.name}>
              {food.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Grams"
        type="number"
        variant="outlined"
        fullWidth
        value={grams}
        onChange={(e) => setGrams(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={addDailyFood} sx={{ marginBottom: 4 }}>
        Add
      </Button>
      <Button variant="outlined" color="error" onClick={resetDailyIntake} sx={{ marginBottom: 4, marginLeft: 1 }}>
        Reset Daily Intake
      </Button>

      <Typography variant="h5" gutterBottom>
        Today's Intake
      </Typography>
      <Alert icon={false} severity="success">
        <Typography variant="h6">
          Total Calories: <b> {totalCalories.toFixed()}</b>
        </Typography>
        <Typography variant="h6">
          Total Protein: <b>{totalProtein.toFixed()}g</b>
        </Typography>
      </Alert>
      {/* <Divider /> */}
      <List>
        {dailyFood.map((item) => (
          <>
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteDailyEntry(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${item.grams}g ${item.name}`}
                secondary={`Calories: ${item.calories.toFixed(2)}, Protein: ${item.protein.toFixed(2)}g, Time: ${new Date(item.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
              />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>

    </Box>
  );
}

function App() {
  const [foods, setFoods] = useState(() => {
    const storedFoods = JSON.parse(localStorage.getItem('foods')) || [];
    return storedFoods;
  });

  // Dialog state for opening/closing
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Save foods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('foods', JSON.stringify(foods));
  }, [foods]);

  const addFood = (food) => {
    setFoods([...foods, food]);
  };

  return (
    <Container sx={{ paddingTop: 4 }}>
      {/* Add New Food Button */}
      <Button size='large' sx={{ width: "93%", position: "fixed", bottom: "20px", zIndex: 1 }} variant="contained" color="primary" onClick={handleClickOpen}>
        Add New Food
      </Button>

      {/* Dialog for Adding Food */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Food</DialogTitle>
        <DialogContent>
          <FoodManager addFood={addFood} onClose={handleClose} />
        </DialogContent>
      </Dialog>

      <DailyIntake foods={foods} />
    </Container>
  );
}

export default App;
