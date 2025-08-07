import {
  Alert,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { auth } from "@/auth";
import { getServiceEndpoint } from "@/service-discovery";
import SignInButton from "./components/SignInButton";
import SignOutButton from "./components/SignOutButton";

type WeatherForecast = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary?: string;
};

export default async function Home() {
  const session = await auth();

  let error: string | undefined;
  let data: WeatherForecast[] | undefined;

  if (session) {
    const accessToken = session.accessToken;

    const res = await fetch(
      `${getServiceEndpoint("apiservice")}/weatherforecast`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!res.ok) {
      error = res.statusText;
    } else {
      data = (await res.json()) as WeatherForecast[];
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Weather
      </Typography>
      {session ? (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Hello, {session.user?.name}!
            </Typography>
            <SignOutButton />
          </Box>
          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {data && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Temp. (C)</TableCell>
                    <TableCell>Temp. (F)</TableCell>
                    <TableCell>Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((record) => (
                    <TableRow
                      key={record.date}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        {new Date(record.date).toLocaleDateString(undefined, {
                          timeZone: "Etc/UTC",
                        })}
                      </TableCell>
                      <TableCell>{record.temperatureC}</TableCell>
                      <TableCell>{record.temperatureF}</TableCell>
                      <TableCell>{record.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : (
        <>
          <Typography variant="body1" gutterBottom>
            Please sign in to view data.
          </Typography>
          <SignInButton />
        </>
      )}
    </Container>
  );
}
