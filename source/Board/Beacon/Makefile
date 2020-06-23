# name of your application
APPLICATION = iMuseum

# If no BOARD is found in the environment, use this default:
BOARD ?= nrf52dk

# This has to be the absolute path to the RIOT base directory:
RIOTBASE ?= $(CURDIR)/../RIOT

# Include packages that pull up and auto-init the link layer.
# NOTE: 6LoWPAN will be included if IEEE802.15.4 devices are present
USEMODULE += gnrc_netdev_default
USEMODULE += auto_init_gnrc_netif
# Specify the mandatory networking modules for IPv6 and UDP
USEMODULE += gnrc_sock_udp
USEMODULE += gnrc_ipv6_default
# Include MQTT-SN
USEMODULE += emcute
# Add also the shell, some shell commands
USEMODULE += shell
USEMODULE += shell_commands
USEMODULE += ps
# For testing we also include the ping6 command and some stats
USEMODULE += gnrc_icmpv6_echo

USEPKG += nimble
USEPKG += jsmn
USEMODULE += sntp
USEMODULE += auto_init
USEMODULE += xtimer
FEATURES_REQUIRED += periph_rtc


# Enable lowest possible power mode (e.g. STANDBY mode on STM32)
CFLAGS += -DPM_BLOCKER_INITIAL=0x01010100



# Comment this out to disable code in RIOT that does safety checking
# which is not needed in a production environment but helps in the
# development process:
DEVELHELP ?= 1

# Comment this out to join RPL DODAGs even if DIOs do not contain
# DODAG Configuration Options (see the doc for more info)
# CFLAGS += -DGNRC_RPL_DODAG_CONF_OPTIONAL_ON_JOIN
#CFLAGS += -DPM_BLOCKER_INITIAL=0x01010100

# Change this to 0 show compiler invocation lines by default:
QUIET ?= 1

DEBUG = 1
TUI = 1

WERROR = 0

include $(RIOTBASE)/Makefile.include
