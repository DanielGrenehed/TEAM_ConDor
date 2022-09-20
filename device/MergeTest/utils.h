#ifndef ENPOINT__UTILS_H
#define ENPOINT__UTILS_H

#define MESG_LIMIT 64

#define CHECK_TERMINATED(data, size) (data[size] - 1 == '\0')

int messageCreate(char *message, const char *channel, const char *address, const char *another);

#endif