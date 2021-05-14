#include <iostream>
#include <bitset>
#include <utility>

using namespace std;

int main() {
    bitset<8> bits;

    bits.set();             //11111111
    cout << bits << endl;
    bits.reset();           //00000000
    cout << bits << endl;

    bits[0] = 1;            //00000001
    bits[1] = 2;            //00000011
    cout << bits << endl;

    bits.flip();            //11111100
    cout << bits << endl;

    bits ^= 0xF1;           //00001101
    cout << bits << endl;

    bitset<65> bits1;
    cout << sizeof(bits) << endl;       //8
    cout << sizeof(bits1) << endl;      //16

    // return 1;

    char bitschar[128] = {0};
    constexpr auto get_pos = [](const auto &n)
    {
        return make_pair(n / 8, n % 8);
    };
    auto set_bits = [&bitschar](const auto& pos, const bool& set) {
        bitschar[pos.first] ^= (set << pos.second);
    };
    auto ppos = get_pos(999);
    set_bits(ppos, true);
    cout << (int)bitschar[ppos.first] << endl;
}