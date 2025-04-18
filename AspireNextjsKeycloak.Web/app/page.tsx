import {
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
import SignInButton from "./_components/sign-in-button";
import SignOutButton from "./_components/sign-out-button";

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
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Weather
      </Typography>
      {session ? (
        <>
          <Box sx={{ mb: 2 }}>
            Hello, <strong>{session.user?.name}</strong>!
            <div>
              <SignOutButton />
            </div>
          </Box>
          {error && (
            <Typography color="error">
              <strong>Error: </strong> {error}
            </Typography>
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
          Please sign in to view data.
          <div>
            <SignInButton />
          </div>
        </>
      )}
    </Container>
  );
}
