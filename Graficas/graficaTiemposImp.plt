reset session

# Set the output resolution and size
set term png size 2880, 1200 font "FiraCode,30"
set grid ytics lw 2

$Data <<EOD
Superficie                      "Sage (buchberger)"       "Sage (groebner\\\_basis)"   "multivariate\\\_polynomial (implicitateR3)"
Plano                           1.52             1.31          34
"Parab. elíptico"            1.47	        1.62          41	
"Parab. hiperbólico"         1.46               1.41            45
Esfera                          700	        2.26          1222
EOD


set title "Tiempo de cómputo para implicitación" 
set xlabel "Superficie"
set ylabel "Tiempo (ms)"

set auto x
set logscale  y

set yrange [0:10000]
set style data histogram
set style histogram cluster gap 1
set style fill solid border -1
set boxwidth 0.9
set xtic scale 0

set output 'TiemposImp.png'

# 2, 3, 4, 5 are the indexes of the columns; 'fc' stands for 'fillcolor'
plot $Data using 2:xtic(1) ti col , '' u 3 ti col , '' u 4 ti col, '' u 5 ti col 