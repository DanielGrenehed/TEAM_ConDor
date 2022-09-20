#include "endpoint_utils.h"

static int stringSize(const char *string)  {

  // Beräknar string size upp till 'MESG_LIMIT' - 1 (nu satt till 32) för att ge utrymme för null-terminator.

	for (int size = 0; size < MESG_LIMIT - 1; size++) {
    if (string[size] == '\0')
      return size + 1;
  }
  return 0;
}

static void stringMerge(char *buffer, const char *string) {

/* Själva "mergen"/concateneraren. char-array 'buffer' kan vara tom eller redan innehålla data, i alla lägen
 * läggs arg 'string' till på slutet. */

  int sizeBuff = stringSize(buffer);        // size på buffer.
  int sizeStrg = stringSize(string);        // size på string att concatenera.

  int sizeTotal = (sizeBuff + sizeStrg) - 1;// size på gamla buffern + nya strängen (minus en av terminatorerna).

  int lastIndex = 0;                        // senaste index på buffern.
  int ccatIndex = 0;                        // index på byte att concata till bufferns nuvarande last

  for (lastIndex = sizeBuff - 1, ccatIndex = 0; lastIndex < sizeTotal; lastIndex++, ccatIndex++) {
  	buffer[lastIndex] = string[ccatIndex];
  }
}

static void StringFlush(char *string) {
  for (int i = 0; i < MESG_LIMIT - 1; i++)
    string[i] = '\0';
}

int messageCreate(char *message, const char *channel, const char *address, const char *another) {

  // Börjar med att spola ren message-buffern från tidigare data;
  StringFlush(message);

  // Just nu har jag bara tre test-strängar som ska concateneras som test, 'channel' och (MAC)'address'. Dock gjort 
  // det skalbart utefter att vi ämnar skjuta till med fler trängar/data till meddelandet.

  stringMerge(message, channel);
  stringMerge(message, address);
  stringMerge(message, another);
  // ... osv

  // kontrollerar så att den mergade strängen är null-terminerad.
  if (CHECK_TERMINATED(message, stringSize(message)))
    return 0;
  return 1;
}
