#ifdef BUILD_MODULE_GPIO
enum gpio_ports {
    PDA, PDB, PDC
};

// prefix before GPIO device id
static const char *digital_prefix = "GPIO_";

// map gpio_ports integers to device id characters
static const char *digital_convert = "012";

static const pin_map_t digital_pins[] = {
{PDA, 3},    // D0
{PDA, 2},    // D1
{PDA, 10},   // D2
{PDB, 3},    // D3
{PDB, 5},    // D4
{PDB, 4},    // D5
{PDB, 10},   // D6
{PDA, 8},    // D7
{PDA, 9},    // D8
{PDC, 7},    // D9
{PDB, 6},    // D10
{PDA, 7},    // D11
{PDA, 6},    // D12
{PDA, 5},    // D13
{PDB, 9},    // D14
{PDB, 8},    // D15
{PDC, 13},   //USER button
};

static const prefix_range_t digital_map[] ={
{"D", 0, 0, 15},    // D0- D15
{"SW", 0, 0, 0},    //USER button
};

static const extra_pin_t digital_extras[] = {};

#endif  // BUILD_MODULE_GPIO
#ifdef BUILD_MODULE_AIO
enum aio_ports {
PAA,PAB,PAC
};

// prefix before GPIO device id
static const char *analog_prefix = "ADC_";

// map gpio_ports integers to device id characters
static const char *analog_convert = "012";

static const pin_map_t analog_pins[] = {
{PAA, 0},    // A0
{PAA, 1},    // A1
{PAA, 4},    // A2
{PAB, 0},    // A3
{PAC, 1},    // A4
{PAC, 0},    // A5
};

static const prefix_range_t analog_map[]={
    {"A", 0, 0, 5} //A0-A5
};
static const extra_pin_t analog_extras[] = {};
#endif  // BUILD_MODULE_AIO


