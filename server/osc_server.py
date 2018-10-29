from liblo import *
from socket import *
import sys
import time

s = socket(AF_INET, SOCK_DGRAM)
s.bind(('', 0))
s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)

class MuseServer(ServerThread):
    #listen for messages on port 5001
    print 'Listening for messages on port 5001'

    eeg = None
    timestamp = None
    dataIsGood = None
    dataArel = None
    dataBrel = None
    dataDrel = None
    dataTrel = None
    dataGrel = None
    BROADCAST_PORT = 50000
    count = 0
    tot = 0

    def __init__(self):
        ServerThread.__init__(self, 5001)


    #receive EEG data
    #@make_method('/muse/eeg', 'ffff')
    @make_method('/muse/eeg', 'ffffii')
    def eeg_callback(self, path, args):


        #l_ear, l_forehead, r_forehead, r_ear = args
        #self.timestamp = "%i%s%i" % (123, ".", 123)

        l_ear, l_forehead, r_forehead, r_ear, time, ms = args
        self.timestamp = "%i%s%i" % (time, ".", ms)
        #print time
        #self.timestamp = "%i%s%i" % (time, ".", ms)

        self.eeg = "%f %f %f %f" % (l_ear, l_forehead, r_forehead, r_ear)

        msgEEG = "%s%s,%s" % ('eeg:::',self.timestamp, self.eeg)
        # Send to node.js server
        s.sendto(msgEEG, ('<broadcast>', self.BROADCAST_PORT))

        #self.dispatch()


    #receive EEG data
    @make_method('/muse/elements/is_good', 'ffff')
    def isGood_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        self.dataIsGood = "%s %f %f %f %f" % (path.split('/')[3], l_ear, l_forehead, r_forehead, r_ear)
        #print 'is_good'
        self.dispatch()

    @make_method('/muse/elements/alpha_absolute', 'ffff')
    def aRel_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        self.dataArel = "%s %f %f %f %f" % ("alpha_relative", l_ear, l_forehead, r_forehead, r_ear)
        #print 'alpha'
        self.dispatch()

    @make_method('/muse/elements/beta_absolute', 'ffff')
    def bRel_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        self.dataBrel = "%s %f %f %f %f" % ("beta_absolute", l_ear, l_forehead, r_forehead, r_ear)
        #print 'beta'
        self.dispatch()

    @make_method('/muse/elements/delta_absolute', 'ffff')
    def dRel_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        self.dataDrel = "%s %f %f %f %f" % ("delta_relative", l_ear, l_forehead, r_forehead, r_ear)
        #print 'delta'
        self.dispatch()

    @make_method('/muse/elements/theta_absolute', 'ffff')
    def tRel_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        self.dataTrel = "%s %f %f %f %f" % ("theta_relative", l_ear, l_forehead, r_forehead, r_ear)
        #print 'theta'
        self.dispatch()

    @make_method('/muse/elements/gamma_absolute', 'ffff')
    def gRel_callback(self, path, args):
        l_ear, l_forehead, r_forehead, r_ear = args
        self.dataGrel = "%s %f %f %f %f" % ("gamma_relative", l_ear, l_forehead, r_forehead, r_ear)

        #print 'gamma'
        self.dispatch()


    def dispatch(self):
        self.count += 1


        if self.count == 6:
            self.tot += 1
            #print self.tot
            msgBands = "%s%s,%s,%s,%s,%s,%s" % ('elements:::',self.dataIsGood, self.dataArel, self.dataBrel, self.dataDrel, self.dataTrel, self.dataGrel)
            self.count = 0
            # Send to node.js server
            s.sendto(msgBands, ('<broadcast>', self.BROADCAST_PORT))

try:
    server = MuseServer()
except ServerError, err:
    print str(err)
    sys.exit()

server.start()

if __name__ == "__main__":
    while 1:
        time.sleep(1)
