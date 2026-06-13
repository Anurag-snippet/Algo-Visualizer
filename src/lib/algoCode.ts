// C++ and Python reference implementations for each algorithm.
// Used by the CodeViewer dialog.

export type CodeBundle = { cpp: string; python: string };

export const sortingCode: Record<string, CodeBundle> = {
  bubble: {
    cpp: `#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # already sorted
    return arr`,
  },
  quick: {
    cpp: `#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  },
  merge: {
    cpp: `#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else                      arr[k++] = right[j++];
    }
    while (i < (int)left.size())  arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  },
};

export const pathfindingCode: Record<string, CodeBundle> = {
  dijkstra: {
    cpp: `#include <vector>
#include <queue>
#include <climits>
using namespace std;

struct Node { int row, col, dist; };
struct Cmp { bool operator()(const Node& a, const Node& b){ return a.dist > b.dist; } };

vector<pair<int,int>> dijkstra(vector<vector<int>>& grid,
                               pair<int,int> start, pair<int,int> target) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<int>> dist(R, vector<int>(C, INT_MAX));
    vector<vector<pair<int,int>>> prev(R, vector<pair<int,int>>(C, {-1,-1}));
    priority_queue<Node, vector<Node>, Cmp> pq;

    dist[start.first][start.second] = 0;
    pq.push({start.first, start.second, 0});
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};

    while (!pq.empty()) {
        Node u = pq.top(); pq.pop();
        if (u.dist > dist[u.row][u.col]) continue;
        if (u.row == target.first && u.col == target.second) break;
        for (int k = 0; k < 4; k++) {
            int nr = u.row + dr[k], nc = u.col + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (grid[nr][nc] == 1) continue; // wall
            int nd = u.dist + 1;
            if (nd < dist[nr][nc]) {
                dist[nr][nc] = nd;
                prev[nr][nc] = {u.row, u.col};
                pq.push({nr, nc, nd});
            }
        }
    }
    // reconstruct
    vector<pair<int,int>> path;
    pair<int,int> cur = target;
    while (cur.first != -1) {
        path.push_back(cur);
        cur = prev[cur.first][cur.second];
    }
    reverse(path.begin(), path.end());
    return path;
}`,
    python: `import heapq

def dijkstra(grid, start, target):
    R, C = len(grid), len(grid[0])
    dist = [[float('inf')] * C for _ in range(R)]
    prev = [[None] * C for _ in range(R)]
    dist[start[0]][start[1]] = 0
    pq = [(0, start[0], start[1])]

    while pq:
        d, r, c = heapq.heappop(pq)
        if d > dist[r][c]:
            continue
        if (r, c) == target:
            break
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1:
                nd = d + 1
                if nd < dist[nr][nc]:
                    dist[nr][nc] = nd
                    prev[nr][nc] = (r, c)
                    heapq.heappush(pq, (nd, nr, nc))

    # reconstruct path
    path, cur = [], target
    while cur is not None:
        path.append(cur)
        cur = prev[cur[0]][cur[1]]
    return path[::-1]`,
  },
  floydWarshall: {
    cpp: `#include <vector>
#include <climits>
using namespace std;

vector<pair<int,int>> floydWarshall(vector<vector<int>>& grid,
                                   pair<int,int> start, pair<int,int> target) {
    int R = grid.size(), C = grid[0].size();
    int N = R * C;
    const int INF = INT_MAX / 2;
    vector<vector<int>> dist(N, vector<int>(N, INF));
    vector<vector<int>> next(N, vector<int>(N, -1));

    auto idx = [&](int r, int c){ return r * C + c; };
    auto valid = [&](int r, int c){ return r >= 0 && r < R && c >= 0 && c < C; };

    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            int u = idx(r, c);
            if (grid[r][c] == 1) continue;
            dist[u][u] = 0;
            next[u][u] = u;
            int dr[] = {-1,1,0,0};
            int dc[] = {0,0,-1,1};
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (!valid(nr, nc) || grid[nr][nc] == 1) continue;
                int v = idx(nr, nc);
                dist[u][v] = 1;
                next[u][v] = v;
            }
        }
    }

    for (int k = 0; k < N; k++) {
        for (int i = 0; i < N; i++) {
            if (dist[i][k] == INF) continue;
            for (int j = 0; j < N; j++) {
                if (dist[k][j] == INF) continue;
                int candidate = dist[i][k] + dist[k][j];
                if (candidate < dist[i][j]) {
                    dist[i][j] = candidate;
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    int s = idx(start.first, start.second);
    int t = idx(target.first, target.second);
    vector<pair<int,int>> path;
    if (next[s][t] == -1) return path;

    int cur = s;
    while (cur != t) {
        int r = cur / C;
        int c = cur % C;
        path.push_back({r, c});
        cur = next[cur][t];
        if (cur == -1) return vector<pair<int,int>>();
    }
    path.push_back({t.first, t.second});
    return path;
}`,
    python: `import math

def floyd_warshall(grid, start, target):
    R, C = len(grid), len(grid[0])
    N = R * C
    INF = math.inf
    dist = [[INF] * N for _ in range(N)]
    nxt = [[-1] * N for _ in range(N)]

    def idx(r, c):
        return r * C + c

    def valid(r, c):
        return 0 <= r < R and 0 <= c < C

    for r in range(R):
        for c in range(C):
            u = idx(r, c)
            if grid[r][c] == 1:
                continue
            dist[u][u] = 0
            nxt[u][u] = u
            for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                nr, nc = r + dr, c + dc
                if valid(nr, nc) and grid[nr][nc] != 1:
                    v = idx(nr, nc)
                    dist[u][v] = 1
                    nxt[u][v] = v

    for k in range(N):
        for i in range(N):
            if dist[i][k] == INF: continue
            for j in range(N):
                if dist[k][j] == INF: continue
                candidate = dist[i][k] + dist[k][j]
                if candidate < dist[i][j]:
                    dist[i][j] = candidate
                    nxt[i][j] = nxt[i][k]

    s, t = idx(start[0], start[1]), idx(target[0], target[1])
    if nxt[s][t] == -1:
        return []

    path = []
    cur = s
    while cur != t:
        r, c = divmod(cur, C)
        path.append((r, c))
        cur = nxt[cur][t]
        if cur == -1:
            return []
    path.append((target[0], target[1]))
    return path`
  },
  bfs: {
    cpp: `#include <vector>
#include <queue>
using namespace std;

vector<pair<int,int>> bfs(vector<vector<int>>& grid,
                          pair<int,int> start, pair<int,int> target) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<bool>> visited(R, vector<bool>(C, false));
    vector<vector<pair<int,int>>> prev(R, vector<pair<int,int>>(C, {-1,-1}));
    queue<pair<int,int>> q;
    q.push(start);
    visited[start.first][start.second] = true;
    int dr[] = {-1,1,0,0}, dc[] = {0,0,-1,1};

    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        if (make_pair(r, c) == target) break;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (visited[nr][nc] || grid[nr][nc] == 1) continue;
            visited[nr][nc] = true;
            prev[nr][nc] = {r, c};
            q.push({nr, nc});
        }
    }
    vector<pair<int,int>> path;
    pair<int,int> cur = target;
    while (cur.first != -1) { path.push_back(cur); cur = prev[cur.first][cur.second]; }
    reverse(path.begin(), path.end());
    return path;
}`,
    python: `from collections import deque

def bfs(grid, start, target):
    R, C = len(grid), len(grid[0])
    visited = [[False] * C for _ in range(R)]
    prev = [[None] * C for _ in range(R)]
    q = deque([start])
    visited[start[0]][start[1]] = True

    while q:
        r, c = q.popleft()
        if (r, c) == target:
            break
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and not visited[nr][nc] and grid[nr][nc] != 1:
                visited[nr][nc] = True
                prev[nr][nc] = (r, c)
                q.append((nr, nc))

    path, cur = [], target
    while cur is not None:
        path.append(cur)
        cur = prev[cur[0]][cur[1]]
    return path[::-1]`,
  },
};
