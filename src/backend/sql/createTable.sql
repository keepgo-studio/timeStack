PRAGMA foreign_keys = ON;

DROP TABLE stack_node;
CREATE TABLE stack_node(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INT, -- required
    month INT, -- required
    start_date INT, -- required
    end_date INT, -- required
    start_time TEXT, -- required
    end_time TEXT, -- required
    total_time TEXT,

    time_type_of_period INT, -- required
    memo_of_period INT,
    FOREIGN KEY(time_type_of_period) REFERENCES time_type(title) ON UPDATE CASCADE,
    FOREIGN KEY(memo_of_period) REFERENCES memo(id)
);

CREATE TABLE memo(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tui_file BLOB -- required
);

CREATE TABLE time_type(
    title TEXT PRIMARY KEY, -- required
    color TEXT
);

CREATE TABLE pause_node(
    name TEXT,
    start_time TEXT,
    end_time TEXT,

    stack_node_id INT,
    FOREIGN KEY(stack_node_id) REFERENCES stack_node(id)
);
