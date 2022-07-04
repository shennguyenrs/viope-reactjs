import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function AddBook(props) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState({
    title: "",
    author: "",
    year: "",
    isbn: "",
    price: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const inputChanged = (event) => {
    setBook({ ...book, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    props.addBook(book);
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Add Book
      </Button>
      <Dialog open={open}>
        <DialogTitle>New Book</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            value={book.title}
            onChange={inputChanged}
            margin="dense"
            label="Description"
            fullWidth
          />
          <TextField
            name="author"
            value={book.author}
            onChange={inputChanged}
            margin="dense"
            label="Date"
            fullWidth
          />
          <TextField
            name="year"
            value={book.year}
            onChange={inputChanged}
            margin="dense"
            label="Priority"
            fullWidth
          />
          <TextField
            name="isbn"
            value={book.isbn}
            onChange={inputChanged}
            margin="dense"
            label="Date"
            fullWidth
          />
          <TextField
            name="price"
            value={book.price}
            onChange={inputChanged}
            margin="dense"
            label="Priority"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setBooks(valueKeys);
  };

  const fetchItems = () => {
    fetch(
      "https://viope-bookstore-default-rtdb.europe-west1.firebasedatabase.app/books/.json"
    )
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addBook = (newBook) => {
    fetch(
      "https://viope-bookstore-default-rtdb.europe-west1.firebasedatabase.app/books/.json",
      {
        method: "POST",
        body: JSON.stringify(newBook),
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  const deleteTodo = (id) => {
    fetch(
      `https://viope-bookstore-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" noWrap>
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div
        className="ag-theme-material"
        style={{ height: 400, width: 600, margin: "auto" }}
      >
        <AgGridReact rowData={books}>
          <AgGridColumn sortable={true} filter={true} field="title" />
          <AgGridColumn sortable={true} filter={true} field="author" />
          <AgGridColumn sortable={true} filter={true} field="year" />
          <AgGridColumn sortable={true} filter={true} field="isbn" />
          <AgGridColumn sortable={true} filter={true} field="price" />
          <AgGridColumn
            headerName=""
            field="id"
            width={90}
            cellRendererFramework={(params) => (
              <IconButton
                onClick={() => deleteTodo(params.value)}
                size="small"
                color="secondary"
              >
                <Delete />
              </IconButton>
            )}
          />
        </AgGridReact>
      </div>
    </div>
  );
}
