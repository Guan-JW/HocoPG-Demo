DROP TABLE dna_seq;

CREATE TABLE dna_seq(seq_id SERIAL PRIMARY KEY,
exp_date DATE NOT NULL,
quality_score DECIMAL(5,2),
exp_log TEXT STORAGE External);

insert into test values(1,'2023-03-21',91.9,(repeat('[07.27 10:29:39] chrome.exe *64 - manhua.163.com:80 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
[07.27 10:29:39] chrome.exe *64 - nos.netease.com:443 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
[07.27 10:29:39] chrome.exe *64 - manhua.163.com:443 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
[07.27 10:29:39] chrome.exe *64 - manhua.163.com:80 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
[07.27 10:29:39] chrome.exe *64 - c.cnzz.com:80 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
[07.27 10:29:39] chrome.exe *64 - c.cnzz.com:80 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS ',300))); 
insert into dna_seq values(2,'2023-03-22',95.5,(repeat('Jun  9 06:06:20 combo syslogd 1.4.1: restart.
    Jun  9 06:06:20 combo syslog: syslogd startup succeeded
    Jun  9 06:06:20 combo syslog: klogd startup succeeded
    Jun  9 06:06:20 combo kernel: klogd 1.4.1, log source = /proc/kmsg started. ',300))); 
insert into dna_seq values(3,'2023-03-23',93.2,(repeat('Jun  9 06:06:20 combo kernel:  BIOS-e820: 0000000000000000 - 00000000000a0000 (usable)
    Jun  9 06:06:20 combo kernel:  BIOS-e820: 00000000000f0000 - 0000000000100000 (reserved)
    Jun  9 06:06:20 combo kernel:  BIOS-e820: 0000000000100000 - 0000000007eae000 (usable)
    Jun  9 06:06:20 combo kernel:  BIOS-e820: 0000000007eae000 - 0000000008000000 (reserved)
    Jun  9 06:06:20 combo kernel:  BIOS-e820: 00000000ffb00000 - 0000000100000000 (reserved)
    Jun  9 06:06:20 combo kernel: 0MB HIGHMEM available.
    Jun  9 06:06:20 combo kernel: 126MB LOWMEM available.
    Jun  9 06:06:20 combo kernel: zapping low mappings. ',300))); 
insert into dna_seq values(4,'2023-03-24',93.1,(repeat('[10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 0 bytes sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 1228 bytes (1.19 KB) sent, 0 bytes received, lifetime <1 sec
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:06] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS ',300))); 
insert into dna_seq values(5,'2023-03-25',89.3,(repeat('[10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 436 bytes sent, 8613 bytes (8.41 KB) received, lifetime <1 sec
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 464 bytes sent, 1101 bytes (1.07 KB) received, lifetime <1 sec
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 1727 bytes (1.68 KB) sent, 14050 bytes (13.7 KB) received, lifetime <1 sec
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 1326 bytes (1.29 KB) sent, 10540 bytes (10.2 KB) received, lifetime 00:01
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 1761 bytes (1.71 KB) sent, 27951 bytes (27.2 KB) received, lifetime <1 sec
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 2430 bytes (2.37 KB) sent, 530823 bytes (518 KB) received, lifetime 00:02
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 close, 1190 bytes (1.16 KB) sent, 1671 bytes (1.63 KB) received, lifetime 00:02
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS
    [10.30 16:49:08] chrome.exe - proxy.cse.cuhk.edu.hk:5070 open through proxy proxy.cse.cuhk.edu.hk:5070 HTTPS ',300))); 
insert into dna_seq values(6,'2023-03-26',95.5, (repeat('Whispers of the stars weave stories in the light. A moonbeams caress, soft on the cheek ',300))); 
insert into dna_seq values(7,'2023-03-27', 88.2, (repeat('aaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbabcdefghigk',40))); 
