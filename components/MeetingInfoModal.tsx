"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeetingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  meetingUrl: string;
}

const MeetingInfoModal = ({
  isOpen,
  onClose,
  meetingId,
  meetingUrl,
}: MeetingInfoModalProps) => {
  const [participantEmail, setParticipantEmail] = useState("");
  const [invitedParticipants, setInvitedParticipants] = useState<string[]>([]);
  const { toast } = useToast();

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast({
        title: "Success",
        description: "Meeting link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy meeting link",
        variant: "destructive",
      });
    }
  };

  const addParticipant = () => {
    if (participantEmail.trim() && !invitedParticipants.includes(participantEmail.trim())) {
      setInvitedParticipants(prev => [...prev, participantEmail.trim()]);
      setParticipantEmail("");
      toast({
        title: "Success",
        description: "Participant added!",
      });
    } else if (invitedParticipants.includes(participantEmail.trim())) {
      toast({
        title: "Error",
        description: "Participant already added",
        variant: "destructive",
      });
    }
  };

  const removeParticipant = (email: string) => {
    setInvitedParticipants(prev => prev.filter(p => p !== email));
    toast({
      title: "Success",
      description: "Participant removed",
    });
  };

  const sendInvitations = () => {
    // Here you would typically integrate with an email service
    // For now, we'll just show a success message
    if (invitedParticipants.length > 0) {
      toast({
        title: "Success",
        description: `Invitations sent to ${invitedParticipants.length} participant(s)!`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-full !max-w-md !gap-0 !p-0 !bg-[#1C1F2E] !border-[#252A41] !text-white !rounded-2xl shadow-2xl !max-h-[90vh] overflow-hidden flex flex-col">
        {/* Remove default close button */}
        <div className="absolute top-0 right-0 opacity-0 pointer-events-none">
          {/* This hides the default close button */}
        </div>
        
        {/* Header - Fixed */}
        <div className="relative px-6 py-5 border-b border-[#252A41] flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Your meeting&apos;s ready
            </h2>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 rounded-full p-1.5 hover:bg-[#252A41] transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable if needed */}
        <div className="px-6 pb-6 space-y-4 flex-1 overflow-y-auto">
          {/* Add Others Button */}
          <Button
            onClick={() => {/* Handle add others */}}
            className="w-full !bg-[#0E78F9] hover:!bg-blue-600 !text-white font-medium py-2.5 text-sm rounded-lg border-0"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add others
          </Button>

          {/* Meeting Link Section */}
          <div className="space-y-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              Or share this meeting link with others you want in the meeting
            </p>
            
            <div className="flex items-center bg-[#252A41] rounded-lg p-3 border border-[#252A41]">
              <span className="text-xs text-white font-mono flex-1 truncate pr-2">
                {meetingUrl || 'Loading...'}
              </span>
              <button
                onClick={copyMeetingLink}
                className="flex-shrink-0 p-1.5 hover:bg-[#1C1F2E] rounded-md transition-colors"
                title="Copy link"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Warning Text */}
          <div className="flex items-start space-x-2 p-3 bg-[#252A41] rounded-lg">
            <div className="w-4 h-4 rounded-full bg-[#0E78F9] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              People who use this meeting link must get your permission before they can join.
            </p>
          </div>

          {/* User Info */}
          <div className="pt-2">
            <p className="text-xs text-gray-400">
              Joined as <span className="text-gray-300">unknown</span>
            </p>
          </div>

          {/* Email Input Section */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter email to invite"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                className="flex-1 !bg-[#252A41] !border-[#252A41] !text-white placeholder:!text-gray-400 h-10 rounded-lg focus:!border-[#0E78F9]"
              />
              <Button
                onClick={addParticipant}
                className="!bg-[#0E78F9] hover:!bg-blue-600 px-3 h-10 rounded-lg border-0"
                disabled={!participantEmail.trim()}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Invited Participants Section */}
          {invitedParticipants.length > 0 && (
            <div className="space-y-3 border-t border-[#252A41] pt-4">
              <p className="text-sm font-medium text-gray-300">
                Invited Participants ({invitedParticipants.length})
              </p>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {invitedParticipants.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#252A41] px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-300">
                      {email}
                    </span>
                    <button
                      onClick={() => removeParticipant(email)}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-[#1C1F2E] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={sendInvitations}
                className="w-full !bg-green-600 hover:!bg-green-700 !text-white font-medium py-2 rounded-lg border-0"
              >
                Send Invitations
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingInfoModal;
