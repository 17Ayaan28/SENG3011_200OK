import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'name', label: 'NAME', minWidth: 170 },
  { id: 'code', label: 'ISO CODE', minWidth: 100 },
  { id: 'age', label: 'AGE', minWidth: 100 },
  {
    id: 'vaccines_taken',
    label: 'VACCINES TAKEN',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
];

function createData(name, code,age, vaccines_taken) {
  return { name, code, age, vaccines_taken };
}

const rows = [
  createData('Sharma/Ajay', 'IN', 34, ['Meales, H1N1, Rabies, Hepatitis A, Polio, Typhoid fever']),
  createData('An/Wenlan', 'CN', 44, ['Covid-19, Mumps, Rubella, Polio, Typhoid fever']),
  createData('Bao/Cristin', 'IT', 22, ['Covid-19, Varicella, Tuberculosis, Polio, Typhoid fever']),
  createData('John/Ben', 'US', 66, ['Covid-19, Rotavirus, Typhoid fever']),
  createData('John/Stacey', 'CA', 37, ['Covid-19, Measles, Haemophilus influenza type B, Polio, Typhoid fever']),
  createData('Burrows/Rodneymr', 'AU', 76, ['Covid-19, Influenza, Rotavirus, Tuberculosis, Measles, Rubella, Hepatitis A, Varicella, H1N1, Rabies, Influenza, Polio, Typhoid fever']),
  createData('Burrows/Marymrs', 'AU', 70, ['Covid-19, Influenza, Rotavirus, Pertusis, Tuberculosis, Polio, Typhoid fever']),
  createData('Gibson/Shany', 'DE', 45, ['Covid-19, Cholera, Japenese Encephalitis, Polio, Typhoid fever']),
  createData('Hintz/Flo', 'IE', 33, ['Covid-19, Measles, Haemophilus influenza type B, Polio, Typhoid fever']),
  createData('Kihn/Arnaldo', 'MX', 20, ['Covid-19, Influenza, Typhoid fever']),
  createData('Takada/Kenzo', 'JP', 26, ['Covid-19, Yellow fever, Typhoid fever']),
  createData('Louis/Natan', 'FR', 25, ['Covid-19, Meningoccal disease, Typhoid fever']),
  createData('Brinigh/Cassy', 'GB', 25, ['Covid-19, Influenza, Typhoid fever']),
  createData('Putin/Vladimir', 'RU', 52, ['Covid-19, Tick-borne encephalitis, Influenza, Typhoid fever']),
  createData('Stalin/Joseph', 'NG', 34, ['Covid-19, Cholera, Hepatitis E, Rabies']),
  createData('Pedro/Lucas', 'BR', 41, ['Covid-19, Measles, Influenza, Typhoid fever'])
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
        <br />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}