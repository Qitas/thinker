#include <stack>
#include <vector>
#include <iostream>
#include <string>

using namespace std;

enum class STAT
{
    START,
    NEXT,
    SEMPTY_T,
    SEMPTY_F,
    OP_T,
    OP_F,
    LEMPTY_T,
    LEMPTY_F,
    EXIT
};

template <typename FOP>
void mStack(stack<int> &s, const vector<int> &list, FOP &&fop)
{
    auto sempty = [&]() -> bool {
        return s.empty();
    };
    auto op = [&](const int &a) -> bool {
        return fop(s.top(), a);
    };
    int lpos = 0;
    auto lempty = [&]() -> bool {
        return lpos >= list.size();
    };
    auto lnext = [&]() -> int {
        return list[lpos++];
    };
    auto push = [&](const int &a) {
        s.push(a);
    };
    auto pop = [&]() {
        s.pop();
    };

    STAT stat = STAT::START;
    int a = -1;
    do
    {
        switch (stat)
        {
        case STAT::START:
            stat = lempty() ? STAT::LEMPTY_T : STAT::LEMPTY_F;
            break;
        case STAT::NEXT:
            a = lnext();
            stat = sempty() ? STAT::SEMPTY_T : STAT::SEMPTY_F;
            break;
        case STAT::SEMPTY_T:
            push(a);
            stat = STAT::START;
            break;
        case STAT::SEMPTY_F:
            stat = op(a) ? STAT::OP_T : STAT::OP_F;
            break;
        case STAT::OP_T:
            push(a);
            stat = STAT::START;
            break;
        case STAT::OP_F:
            pop();
            stat = sempty() ? STAT::SEMPTY_T : STAT::SEMPTY_F;
            break;
        case STAT::LEMPTY_T:
            stat = STAT::EXIT;
            break;
        case STAT::LEMPTY_F:
            stat = STAT::NEXT;
            break;
        }
    } while (STAT::EXIT != stat);
}

int main()
{
    vector<int> cs{2, 11, 6, 4, 5, 9, 8, 1, 7, 0};
    stack<int> ss;

    mStack(ss, cs, [](const int &a, const int &b) { return a > b; });

    while (!ss.empty())
    {
        cout << ss.top() << " ";
        ss.pop();
    }

    return 1;
}